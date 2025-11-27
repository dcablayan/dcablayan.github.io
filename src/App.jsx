import Hero from './sections/Hero';
import Experience from './sections/Experience';
import NeuralNetwork from './components/NeuralNetwork';

function App() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Neural Network Background */}
      <NeuralNetwork />

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        <Experience />
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export default App;
