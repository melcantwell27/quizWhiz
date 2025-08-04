import { Card, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ResultCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{
  bgcolor?: string;
}>(({ theme, bgcolor }) => ({
  borderRadius: theme.shape.borderRadius,
  minWidth: 0,
  padding: theme.spacing(1),
  textAlign: 'center',
  boxShadow: theme.shadows[2],
  background: bgcolor || theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export const ResultValueBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(1)}`,
  marginBottom: theme.spacing(2),
}));

export const ResultLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 800,
  padding: `${theme.spacing(0.5)}`,
})); 