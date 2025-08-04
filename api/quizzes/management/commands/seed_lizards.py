from django.core.management.base import BaseCommand
from django.db import connection
from quizzes.models import Quiz, Student, MCQ, Choice, FTQ
from django.db import transaction

# A structured, scalable way to define all our seed data.
# This makes it much easier to add new quizzes and questions in the future.
QUIZ_DATA = [
    {
        "name": "Lizard Biology & Habits",
        "questions": [
            {"type": "mcq", "text": "What is the primary defense mechanism of the chameleon?", "points": 5, "choices": [{"text": "Playing dead", "correct": False}, {"text": "Camouflage", "correct": True}, {"text": "Running quickly", "correct": False}, {"text": "Biting", "correct": False}]},
            {"type": "mcq", "text": "Which of these lizards can 'walk' on water?", "points": 8, "choices": [{"text": "Gecko", "correct": False}, {"text": "Iguana", "correct": False}, {"text": "Basilisk lizard", "correct": True}, {"text": "Komodo dragon", "correct": False}]},
            {"type": "mcq", "text": "What is the Jacobson's organ primarily used for?", "points": 6, "choices": [{"text": "Hearing", "correct": False}, {"text": "Seeing in UV", "correct": False}, {"text": "Smelling and tasting the air", "correct": True}, {"text": "Balancing", "correct": False}]},
            {"type": "mcq", "text": "The shedding of skin in reptiles is known as what?", "points": 4, "choices": [{"text": "Ecdysis", "correct": True}, {"text": "Metamorphosis", "correct": False}, {"text": "Autotomy", "correct": False}, {"text": "Keratosis", "correct": False}]},
            {"type": "mcq", "text": "What is a 'dewlap,' often seen on anole lizards?", "points": 7, "choices": [{"text": "A type of venom", "correct": False}, {"text": "A flap of skin on the throat for display", "correct": True}, {"text": "A specialized scale for climbing", "correct": False}, {"text": "A third eyelid", "correct": False}]},
            {"type": "mcq", "text": "Most lizards are 'ectothermic,' which means they...", "points": 5, "choices": [{"text": "Are warm-blooded", "correct": False}, {"text": "Rely on external sources for heat", "correct": True}, {"text": "Can fly short distances", "correct": False}, {"text": "Give birth to live young", "correct": False}]},
            {"type": "mcq", "text": "Which family of lizards is famously legless?", "points": 6, "choices": [{"text": "Agamidae", "correct": False}, {"text": "Iguanidae", "correct": False}, {"text": "Pygopodidae", "correct": True}, {"text": "Gekkonidae", "correct": False}]},
            {"type": "ftq", "text": "What is the scientific term for a lizard's ability to voluntarily shed its tail?", "points": 15},
        ]
    },
    {
        "name": "Lizard Superlatives",
        "questions": [
            {"type": "mcq", "text": "Which of the following is the largest lizard in the world?", "points": 5, "choices": [{"text": "Green Iguana", "correct": False}, {"text": "Gila Monster", "correct": False}, {"text": "Komodo Dragon", "correct": True}, {"text": "Nile Monitor", "correct": False}]},
            {"type": "mcq", "text": "Which lizard has the longest tongue relative to its body size?", "points": 7, "choices": [{"text": "Iguana", "correct": False}, {"text": "Gecko", "correct": False}, {"text": "Chameleon", "correct": True}, {"text": "Monitor Lizard", "correct": False}]},
            {"type": "mcq", "text": "What is considered the fastest lizard in the world?", "points": 8, "choices": [{"text": "Leopard Gecko", "correct": False}, {"text": "Black Spiny-tailed Iguana", "correct": True}, {"text": "Frill-necked Lizard", "correct": False}, {"text": "Anole", "correct": False}]},
            {"type": "mcq", "text": "The Gila Monster is notable for being one of the few...?", "points": 6, "choices": [{"text": "Legless lizards", "correct": False}, {"text": "Venomous lizards in North America", "correct": True}, {"text": "Flying lizards", "correct": False}, {"text": "Herbivorous lizards", "correct": False}]},
            {"type": "mcq", "text": "Which lizard is known for the colorful, expandable 'frill' around its neck?", "points": 5, "choices": [{"text": "Bearded Dragon", "correct": False}, {"text": "Frill-necked Lizard", "correct": True}, {"text": "Uromastyx", "correct": False}, {"text": "Chuckwalla", "correct": False}]},
            {"type": "mcq", "text": "Which gecko is known for having the most powerful bite, relative to its size?", "points": 7, "choices": [{"text": "Leopard Gecko", "correct": False}, {"text": "Crested Gecko", "correct": False}, {"text": "Day Gecko", "correct": False}, {"text": "Tokay Gecko", "correct": True}]},
            {"type": "mcq", "text": "What is the only lizard species known to live within the Arctic Circle?", "points": 9, "choices": [{"text": "Siberian Sand Lizard", "correct": False}, {"text": "Common European Adder", "correct": False}, {"text": "Viviparous Lizard", "correct": True}, {"text": "Arctic Anole", "correct": False}]},
            {"type": "ftq", "text": "What is the name of the smallest known lizard species, no bigger than a dime?", "points": 10},
        ]
    },
    {
        "name": "Lizards in Mythology & Culture",
        "questions": [
            {"type": "mcq", "text": "The mythical creature often depicted as a giant, winged, fire-breathing lizard is a?", "points": 4, "choices": [{"text": "Griffin", "correct": False}, {"text": "Dragon", "correct": True}, {"text": "Phoenix", "correct": False}, {"text": "Hydra", "correct": False}]},
            {"type": "mcq", "text": "Which Australian rock band is famously named 'King Gizzard & The ___'?", "points": 6, "choices": [{"text": "Chameleons", "correct": False}, {"text": "Geckos", "correct": False}, {"text": "Lizard Wizard", "correct": True}, {"text": "Monitor Lizards", "correct": False}]},
            {"type": "mcq", "text": "In the animated film 'Rango', what type of lizard is the main character?", "points": 5, "choices": [{"text": "Gecko", "correct": False}, {"text": "Iguana", "correct": False}, {"text": "Chameleon", "correct": True}, {"text": "Bearded Dragon", "correct": False}]},
            {"type": "mcq", "text": "The 'Ouroboros,' an ancient symbol depicting a serpent or dragon eating its own tail, represents what concept?", "points": 7, "choices": [{"text": "Chaos", "correct": False}, {"text": "The eternal cycle of renewal", "correct": True}, {"text": "Destruction", "correct": False}, {"text": "Linear time", "correct": False}]},
            {"type": "mcq", "text": "The mythological Basilisk, a serpent king, was reputed to be able to kill with what?", "points": 6, "choices": [{"text": "Its venomous bite", "correct": False}, {"text": "A deadly gaze", "correct": True}, {"text": "A piercing shriek", "correct": False}, {"text": "Fire breath", "correct": False}]},
            {"type": "mcq", "text": "Which famous Dutch artist was known for his mathematically inspired woodcuts, often featuring lizards and geckos?", "points": 8, "choices": [{"text": "Vincent van Gogh", "correct": False}, {"text": "Rembrandt", "correct": False}, {"text": "M. C. Escher", "correct": True}, {"text": "Johannes Vermeer", "correct": False}]},
            {"type": "mcq", "text": "In ancient Egypt, lizards were associated with what?", "points": 7, "choices": [{"text": "The underworld", "correct": False}, {"text": "Chaos and evil", "correct": False}, {"text": "Wisdom and good fortune", "correct": True}, {"text": "Famine", "correct": False}]},
            {"type": "ftq", "text": "In Australian Aboriginal mythology, what large monitor lizard is a prominent creation story figure?", "points": 15}
        ]
    },
    {
        "name": "Lizard Diets & Hunting Strategies",
        "questions": [
            {"type": "mcq", "text": "Which term describes animals that primarily eat insects, a common diet for many lizards?", "points": 4, "choices": [{"text": "Herbivore", "correct": False}, {"text": "Carnivore", "correct": False}, {"text": "Insectivore", "correct": True}, {"text": "Omnivore", "correct": False}]},
            {"type": "mcq", "text": "What is a 'sit-and-wait' or 'ambush' predator's primary hunting strategy?", "points": 5, "choices": [{"text": "Actively chasing prey", "correct": False}, {"text": "Setting traps", "correct": False}, {"text": "Waiting motionlessly for prey to approach", "correct": True}, {"text": "Scavenging", "correct": False}]},
            {"type": "mcq", "text": "The Marine Iguana of the Galapagos is unique for its diet of what?", "points": 7, "choices": [{"text": "Small fish", "correct": False}, {"text": "Crabs", "correct": False}, {"text": "Seaweed and algae", "correct": True}, {"text": "Insects", "correct": False}]},
            {"type": "mcq", "text": "The Horned Lizard of North America almost exclusively eats what?", "points": 6, "choices": [{"text": "Beetles", "correct": False}, {"text": "Spiders", "correct": False}, {"text": "Ants", "correct": True}, {"text": "Scorpions", "correct": False}]},
            {"type": "mcq", "text": "When a lizard uses its tail as a lure to attract prey, it is called what?", "points": 8, "choices": [{"text": "Caudal Luring", "correct": True}, {"text": "Tail Flagging", "correct": False}, {"text": "Distraction Display", "correct": False}, {"text": "Mimicry", "correct": False}]},
            {"type": "mcq", "text": "Monitor lizards are known for being 'hypercarnivores,' which means their diet is more than ___% meat.", "points": 7, "choices": [{"text": "25%", "correct": False}, {"text": "50%", "correct": False}, {"text": "70%", "correct": False}, {"text": "90%", "correct": True}]},
            {"type": "mcq", "text": "What does a 'folivore' lizard eat?", "points": 6, "choices": [{"text": "Fruits", "correct": False}, {"text": "Leaves", "correct": True}, {"text": "Nectar", "correct": False}, {"text": "Seeds", "correct": False}]},
            {"type": "ftq", "text": "What hunting strategy involves waiting motionlessly for prey to come within striking distance?", "points": 10}
        ]
    },
    {
        "name": "Amazing Lizard Defenses",
        "questions": [
            {"type": "mcq", "text": "The Texas Horned Lizard is famous for its ability to deter predators by doing what?", "points": 8, "choices": [{"text": "Playing dead", "correct": False}, {"text": "Squirting blood from its eyes", "correct": True}, {"text": "Inflating its body", "correct": False}, {"text": "Shedding its skin", "correct": False}]},
            {"type": "mcq", "text": "The Armadillo Girdled Lizard protects itself by...", "points": 6, "choices": [{"text": "Digging a burrow", "correct": False}, {"text": "Running into water", "correct": False}, {"text": "Rolling into a tight, spiky ball", "correct": True}, {"text": "Displaying bright warning colors", "correct": False}]},
            {"type": "mcq", "text": "Which lizard can inflate its body with air to wedge itself tightly into rock crevices?", "points": 7, "choices": [{"text": "Gecko", "correct": False}, {"text": "Iguana", "correct": False}, {"text": "Anole", "correct": False}, {"text": "Chuckwalla", "correct": True}]},
            {"type": "mcq", "text": "Some geckos can detach large patches of their skin when grabbed. This defense is known as what?", "points": 8, "choices": [{"text": "Autotomy", "correct": False}, {"text": "Dermolysis", "correct": True}, {"text": "Ecdysis", "correct": False}, {"text": "Mycosis", "correct": False}]},
            {"type": "mcq", "text": "What is 'aposematism' in the animal kingdom?", "points": 7, "choices": [{"text": "A type of camouflage", "correct": False}, {"text": "Warning coloration to signal danger or toxicity", "correct": True}, {"text": "A mating dance", "correct": False}, {"text": "A method of hunting", "correct": False}]},
            {"type": "mcq", "text": "The frill-necked lizard's primary defense is to...", "points": 5, "choices": [{"text": "Bite with venom", "correct": False}, {"text": "Run on two legs", "correct": False}, {"text": "Expand a large neck frill to look bigger", "correct": True}, {"text": "Whip its tail", "correct": False}]},
            {"type": "mcq", "text": "When a lizard changes color to match its surroundings, this is called what?", "points": 6, "choices": [{"text": "Mimicry", "correct": False}, {"text": "Crypsis", "correct": True}, {"text": "Aposematism", "correct": False}, {"text": "Display", "correct": False}]},
            {"type": "ftq", "text": "What is the scientific term for the ability to voluntarily detach a body part?", "points": 15}
        ]
    },
    {
        "name": "Lizard Reproduction & Lifecycles",
        "questions": [
            {"type": "mcq", "text": "What does the term 'oviparous' mean?", "points": 4, "choices": [{"text": "They give live birth", "correct": False}, {"text": "They lay eggs", "correct": True}, {"text": "They reproduce asexually", "correct": False}, {"text": "They change sex", "correct": False}]},
            {"type": "mcq", "text": "Some skink species exhibit 'viviparity,' which means they do what?", "points": 6, "choices": [{"text": "Lay soft-shelled eggs", "correct": False}, {"text": "Guard their nests", "correct": False}, {"text": "Give birth to live young", "correct": True}, {"text": "Abandon their eggs", "correct": False}]},
            {"type": "mcq", "text": "'Parthenogenesis' is a form of asexual reproduction where...", "points": 8, "choices": [{"text": "Offspring develop from unfertilized eggs", "correct": True}, {"text": "The animal splits in two", "correct": False}, {"text": "Males fertilize each other", "correct": False}, {"text": "They are born pregnant", "correct": False}]},
            {"type": "mcq", "text": "In many turtle and lizard species, the sex of the offspring is determined by what?", "points": 7, "choices": [{"text": "Genetics from the father", "correct": False}, {"text": "Genetics from the mother", "correct": False}, {"text": "The temperature of the nest", "correct": True}, {"text": "The time of year", "correct": False}]},
            {"type": "mcq", "text": "A 'hemipenis' refers to what aspect of lizard anatomy?", "points": 6, "choices": [{"text": "A vestigial leg", "correct": False}, {"text": "The paired reproductive organs of males", "correct": True}, {"text": "A type of scent gland", "correct": False}, {"text": "A specialized hearing organ", "correct": False}]},
            {"type": "mcq", "text": "A baby lizard is properly referred to as a what?", "points": 4, "choices": [{"text": "A kit", "correct": False}, {"text": "A pup", "correct": False}, {"text": "A lizardlet", "correct": False}, {"text": "A hatchling", "correct": True}]},
            {"type": "mcq", "text": "Which of the following is a common courtship behavior in lizards?", "points": 5, "choices": [{"text": "Building a nest", "correct": False}, {"text": "Singing a song", "correct": False}, {"text": "Head-bobbing and push-ups", "correct": True}, {"text": "Bringing a gift of food", "correct": False}]},
        ]
    },
    {
        "name": "The Lizard Brain: Senses & Perception",
        "questions": [
            {"type": "mcq", "text": "The 'parietal eye' or 'third eye' on top of a lizard's head is used to detect what?", "points": 7, "choices": [{"text": "Detailed images", "correct": False}, {"text": "Color", "correct": False}, {"text": "Changes in light and shadow", "correct": True}, {"text": "Vibrations", "correct": False}]},
            {"type": "mcq", "text": "Unlike humans, many lizards can see into which part of the light spectrum?", "points": 6, "choices": [{"text": "Infrared", "correct": False}, {"text": "Ultraviolet", "correct": True}, {"text": "X-ray", "correct": False}, {"text": "Microwave", "correct": False}]},
            {"type": "mcq", "text": "A lizard's 'nictitating membrane' is a...", "points": 5, "choices": [{"text": "Tongue sheath", "correct": False}, {"text": "Transparent third eyelid", "correct": True}, {"text": "Protective scale over the ear", "correct": False}, {"text": "Scent gland", "correct": False}]},
            {"type": "mcq", "text": "How do geckos and some other lizards cling to vertical surfaces?", "points": 8, "choices": [{"text": "Suction cups", "correct": False}, {"text": "Static electricity", "correct": False}, {"text": "Microscopic hair-like structures called setae", "correct": True}, {"text": "A sticky mucus", "correct": False}]},
            {"type": "mcq", "text": "Gular pumping, the act of moving the throat up and down, is primarily for what purpose?", "points": 6, "choices": [{"text": "Swallowing large prey", "correct": False}, {"text": "Making sounds", "correct": False}, {"text": "Respiration (breathing)", "correct": True}, {"text": "Cooling down", "correct": False}]},
            {"type": "mcq", "text": "What sense is LEAST developed in most species of burrowing, subterranean lizards?", "points": 7, "choices": [{"text": "Smell", "correct": False}, {"text": "Touch", "correct": False}, {"text": "Hearing", "correct": False}, {"text": "Sight", "correct": True}]},
            {"type": "mcq", "text": "What is the primary purpose of a lizard flicking its tongue in and out?", "points": 5, "choices": [{"text": "To drink water", "correct": False}, {"text": "To threaten rivals", "correct": False}, {"text": "To collect scent particles from the air", "correct": True}, {"text": "To clean its face", "correct": False}]},
            {"type": "ftq", "text": "What organ on the roof of the mouth do lizards use to 'taste' the air?", "points": 15}
        ]
    },
    {
        "name": "Lizards & Human Innovation",
        "questions": [
            {"type": "mcq", "text": "The adhesive, self-cleaning feet of which lizard have inspired new types of tapes and glues?", "points": 6, "choices": [{"text": "Chameleon", "correct": False}, {"text": "Gecko", "correct": True}, {"text": "Iguana", "correct": False}, {"text": "Monitor Lizard", "correct": False}]},
            {"type": "mcq", "text": "The study of creating technology inspired by nature is called what?", "points": 5, "choices": [{"text": "Biology", "correct": False}, {"text": "Robotics", "correct": False}, {"text": "Biomimetics", "correct": True}, {"text": "Naturalism", "correct": False}]},
            {"type": "mcq", "text": "A compound found in Gila monster venom has been developed into a major drug for treating what condition?", "points": 8, "choices": [{"text": "Heart disease", "correct": False}, {"text": "Cancer", "correct": False}, {"text": "Type 2 Diabetes", "correct": True}, {"text": "Arthritis", "correct": False}]},
            {"type": "mcq", "text": "The Sandfish lizard's ability to 'swim' through sand has inspired the design of what?", "points": 7, "choices": [{"text": "New types of boats", "correct": False}, {"text": "Drilling equipment", "correct": False}, {"text": "Search-and-rescue robots for granular environments", "correct": True}, {"text": "Better sand paper", "correct": False}]},
            {"type": "mcq", "text": "What aspect of a lizard's tail regeneration is of primary interest to medical researchers?", "points": 8, "choices": [{"text": "Its speed", "correct": False}, {"text": "Its ability to regrow bone and nerve tissue", "correct": True}, {"text": "Its change in color", "correct": False}, {"text": "The fact that it can be eaten", "correct": False}]},
            {"type": "mcq", "text": "The structure of the Thorny Devil's skin, which channels water to its mouth, has inspired what?", "points": 7, "choices": [{"text": "Better raincoats", "correct": False}, {"text": "More efficient plumbing", "correct": False}, {"text": "Materials that can harvest water from fog", "correct": True}, {"text": "New kinds of sponges", "correct": False}]},
            {"type": "mcq", "text": "The way a chameleon changes color via nanocrystals is being studied to create what?", "points": 9, "choices": [{"text": "Better solar panels", "correct": False}, {"text": "More efficient light bulbs", "correct": False}, {"text": "Advanced new types of display screens", "correct": True}, {"text": "Unbreakable glass", "correct": False}]},
            {"type": "ftq", "text": "Research into what massive lizard's venom is helping develop new drugs for strokes?", "points": 10}
        ]
    }
]


class Command(BaseCommand):
    help = 'Seeds the database with a variety of lizard-themed quizzes.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('--- Starting Database Seed ---'))

        # --- 1. Clean Slate using TRUNCATE ---
        self.stdout.write(self.style.WARNING('DEV-ONLY: Clearing all quiz-related data using TRUNCATE...'))
        # This is the best practice for a development seed script.
        # It completely wipes the tables and RESETS the ID counter, ensuring a
        # clean and predictable state every time the seeder is run.
        # This command should NEVER be used in a production environment.
        with connection.cursor() as cursor:
            # The order matters here due to foreign key constraints.
            # We must delete the "many" side of a relationship before the "one" side.
            cursor.execute("TRUNCATE TABLE quizzes_answer, quizzes_attempt, quizzes_choice, quizzes_mcq, quizzes_ftq, quizzes_quiz, quizzes_student RESTART IDENTITY CASCADE")

        self.stdout.write(self.style.SUCCESS('Tables truncated and ID sequences reset.'))
        
        # --- 2. Create Students ---
        students = [
            Student.objects.create(name='Leo Lizardi', email='leo@example.com'),
            Student.objects.create(name='Sally Salamander', email='sally@example.com'),
            Student.objects.create(name='Iggy Iguana', email='iggy@example.com'),
        ]
        self.stdout.write(self.style.SUCCESS(f'Created {len(students)} students.'))

        # --- 3. Create Quizzes and Questions from QUIZ_DATA ---
        self.stdout.write('Creating new quizzes and questions...')
        num_quizzes = 0
        num_mcqs = 0
        num_ftqs = 0

        for quiz_data in QUIZ_DATA:
            quiz = Quiz.objects.create(name=quiz_data['name'])
            num_quizzes += 1
            for question_data in quiz_data['questions']:
                if question_data['type'] == 'mcq':
                    mcq = MCQ.objects.create(quiz=quiz, question=question_data['text'], points=question_data['points'])
                    num_mcqs += 1
                    for choice_data in question_data['choices']:
                        Choice.objects.create(mcq=mcq, content=choice_data['text'], is_correct=choice_data['correct'])
                elif question_data['type'] == 'ftq':
                    FTQ.objects.create(quiz=quiz, question=question_data['text'], points=question_data['points'])
                    num_ftqs += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {num_quizzes} quizzes.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully created {num_mcqs} multiple choice questions.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully created {num_ftqs} free text questions.'))
        
        # --- 4. Create Sample Attempts and Answers ---
        self.stdout.write('Creating sample attempts and answers...')
        from django.contrib.contenttypes.models import ContentType
        from quizzes.models import Attempt, Answer
        
        # Get content types for polymorphic relationships
        mcq_content_type = ContentType.objects.get_for_model(MCQ)
        ftq_content_type = ContentType.objects.get_for_model(FTQ)
        
        # Create some sample attempts
        sample_attempts = []
        for student in students:
            for quiz in Quiz.objects.all()[:3]:  # First 3 quizzes
                attempt = Attempt.objects.create(
                    student=student,
                    quiz=quiz,
                    time_start='2024-01-15T10:00:00Z',
                    time_end='2024-01-15T10:30:00Z',
                    score=75.0,  # Sample score
                    current_question_type=mcq_content_type,
                    current_question_id=1
                )
                sample_attempts.append(attempt)
        
        # Create sample answers for the first attempt
        if sample_attempts:
            first_attempt = sample_attempts[0]
            
            # Sample MCQ answers
            for mcq in MCQ.objects.filter(quiz=first_attempt.quiz)[:3]:
                correct_choice = mcq.choices.filter(is_correct=True).first()
                if correct_choice:
                    Answer.objects.create(
                        attempt=first_attempt,
                        question_type=mcq_content_type,
                        question_id=mcq.id,
                        selected_choice=correct_choice,
                        is_correct=True
                    )
            
            # Sample FTQ answers
            for ftq in FTQ.objects.filter(quiz=first_attempt.quiz)[:1]:
                Answer.objects.create(
                    attempt=first_attempt,
                    question_type=ftq_content_type,
                    question_id=ftq.id,
                    free_text_response="Autotomy",
                    is_correct=True
                )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(sample_attempts)} sample attempts with answers.'))
        
        self.stdout.write(self.style.SUCCESS('\n--- Database Seeding Complete! ---')) 