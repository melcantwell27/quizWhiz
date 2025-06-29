# Solution
Melanie Cantwell / mel.cantwell27@gmail.com

Demo Link: https://www.loom.com/share/55935915486d40448ae9cc804684b1c1

# Notes on implementation
BE: I started with the BE and conceptualizing what objects & associated fields would be the most supportive & necessarily-distinct. Some of them were a bit more straight-forward, like identifying that we'd defnitely need a Student and Quiz for example. For the Question object, while multiple choice (MCQ) and free-text (FTQ) were both question-types, their answer types fundamentally different, so needed their own separate defining. 

### 1. Question Type Separation vs. Single Table Inheritance
I chose: Separate MCQ and FTQ models instead of a single Question model with a question_type field.

#### Trade-offs

✅ Pros

Type safety, cleaner code, easier to add question-type-specific fields

❌ Cons

More complex queries, need for polymorphic relationships in Answer model

Example: You need GenericForeignKey in Answer to handle both question types, which adds complexity.

### 2. Choice Model Separation vs. Embedded Choices

I chose: Separate Choice model instead of storing choices as JSON in MCQ.

#### Trade-offs

✅ Pros

Easy choice tracking/analytics ("most students pick wrong choice B")

Can modify choices without changing the question

Better data integrity and relationships

❌ Cons

More database tables, slightly more complex queries

Example from your seeder: You can easily create choices and track which ones students select most often. 

Someone looking at the results' analytics might say "Oh, this question is consistently wrong, and ah interesting, most students are choosing the same wrong choice" -- could be insightful for educational guidance.

### 3. Points System Design

I chose: Store points on individual questions (MCQ.points, FTQ.points) with a computed total_points property on Quiz.
Trade-offs:

✅ Pros

Flexible point allocation per question, easy to modify individual question points

❌ Cons

Need to maintain consistency, potential for calculation errors

Example: Your total_points property aggregates points from both question types.

### 4. Serializer Strategy for Quiz vs. Results

I chose: Different serializers for quiz-taking (QuizDetailSerializer) vs. results (QuizWithAnswersSerializer).

#### Trade-offs

✅ Pros

Security (hide correct answers during quiz if student is privy to checking network response for the fetch with question data), clean API separation

❌ Cons

More serializers to maintain, potential for inconsistency

Example: ChoiceQuizSerializer hides is_correct, while ChoiceResultsSerializer shows it.



### FE

I started the FE after building out the db & back-end. I am happy with how it came out. I do reallllly like when hooks are defined outside of the components themselves & imported into the components for use. Likewise, I feel a great sense of satisification when the types are all explicit

#### 1. State Management: Zustand vs. Redux/Context

I chose: Zustand with persistence middleware for auth state.

#### Tradeoffs

✅ Pros

Lightweight, simple API, built-in persistence, good TypeScript support

❌ Cons

Less ecosystem support, fewer middleware options, potential scaling challenges for complex state 
I chose this because this also because this is the state management that I'm most familiar with & I use it often on the FE.

#### 2. Quiz Progress Persistence Strategy

I chose: localStorage for in-progress quiz state instead of server-side only.

#### Tradeoffs

✅ Pros

Works offline, faster resume --> also I use local-storage for user-configration settings in my current SE role.

❌ Cons

Can get out of sync with server, potential data loss, security concerns

#### 3. UI Framework: MUI vs. Custom/Tailwind

I chose: Material-UI with custom styling overrides.

#### Tradeoffs

✅ Pros

Rapid development, consistent design system, good accessibility

❌ Cons

Bundle size, design constraints, MUI tends to leave things look overly standard without some elbow grease to create more custom UI.


### FE: Next.js -> 

React website recommends using Next.js \;) It is React + some built-in goodies that help accelerate development like directory-based routing & Typescript. 

MUI: Love it, use it work. Seems to be industry-standard for flexible modern design. Great community support.


### BE: Python/Django ->

Django is the ORM I'm most familiar with and has nice built-in features that don't require much configuration. In the future, I may continue to work on this project as a way to keep my skills sharp. For the sake of focusing on user-stories first, I didn't leverage Django's built-in auth (a no-password email registration), though if I wanted to add the authentication in, I'd use the user class and a lot of it would come "out of the box". 

### DB: PostgreSQL

It's powerful & supports scalability well. I use this in my current software engineering role.

>>
# How to Run Locally
Clone repo.
Ensure the following are installed: Python, Postgres, Node, npm, venv

### DB setup

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE quizwiz_db;
CREATE USER mel_wizard WITH PASSWORD 'MagicWithin4!';
GRANT ALL PRIVILEGES ON DATABASE quizwiz_db TO mel_wizard;
ALTER USER mel_wizard CREATEDB;
\q

# Test connection
psql -h localhost -U mel_wizard -d quizwiz_db
# Enter password when prompted: MagicWithin4!
```

### Backend setup

```bash
cd api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

# Feedback for Stepful

I liked how open-ended this takehome was & how we could pick what we wanted to focus the most on. The assignment to create a quiz invokes a great BE and FE project. I also liked that the quiz-content itself was open-ended, Lizard Wizarding via Quizzes it is.

For the future: It would have been appreciated if an example of "just fine!" submission. The documentation said "100% story completion" was not expected, though it would have been helpful to know a % expected. If it were only 50% of the user stories, then I could have perhaps spent more time on the FE. Explicit examples of expectation are always welcome.  

Anything else you'd like us to know?

I am a great teammate & love to support & receive support. I value sincerity, both win & outcome-agnostic celebration, challenge, and experimentation IRL and in coding/work environments.

Not required, but we love learning about what you're passionate about, so if you link us a personal blog or website, or anything else that you've written, we'd love to check them out!

In addition to writing code, I also write / record music. This is the most-online music I currently have up!

https://open.spotify.com/album/21yqS2QcreXjCmfD9Aq6Xa?si=6XtCb7aITrmPmP40ppzOyg
