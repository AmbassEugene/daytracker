import { ThemeProvider } from './src/contexts/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
