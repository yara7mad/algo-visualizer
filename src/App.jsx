import { useState, useEffect } from 'react';

export default function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [array, setArray] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);

  // Generate random array on load or algorithm change
  useEffect(() => {
    if (!isAnimating) {
      generateRandomArray();
      setSteps([]);
      setCurrentStep(0);
    }
  }, [selectedAlgorithm]);

  function generateRandomArray(size = 20) {
    const newArr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArr);
  }

  // Bubble Sort steps generator
  function bubbleSortSteps(arr) {
    const a = arr.slice();
    const animationSteps = [];
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          animationSteps.push(a.slice());
        }
      }
    }
    return animationSteps;
  }

  // Insertion Sort steps generator
  function insertion(array) {
    const animations = [];
    const arr = array.slice();
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        animations.push(arr.slice());
        j--;
      }
      arr[j + 1] = key;
      animations.push(arr.slice());
    }
    return animations;
  }

  function startAnimation() {
    if (!selectedAlgorithm) return;

    let newSteps = [];
    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        newSteps = bubbleSortSteps(array);
        break;
      case 'Insertion Sort':
        newSteps = insertion(array);
        break;
      default:
        newSteps = [];
    }

    if (newSteps.length === 0) return;

    setSteps(newSteps);
    setIsAnimating(true);
    setCurrentStep(0);
  }

  useEffect(() => {
    if (isAnimating && steps.length > 0 && currentStep < steps.length) {
      const timeout = setTimeout(() => {
        setArray(steps[currentStep]);
        setCurrentStep(currentStep + 1);
      }, 300);
      return () => clearTimeout(timeout);
    } else if (currentStep >= steps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, steps]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', padding: '20px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ddd' }}>
        <h2>Algorithm Visualizer</h2>

        {/* Algorithm buttons on top */}
        <div style={{ marginBottom: '20px' }}>
          <button
            disabled={isAnimating}
            onClick={() => setSelectedAlgorithm('Bubble Sort')}
            style={{ margin: '5px 0', padding: '10px', width: '100%' }}
          >
            Bubble Sort
          </button>
          <button
            disabled={isAnimating}
            onClick={() => setSelectedAlgorithm('Insertion Sort')}
            style={{ margin: '5px 0', padding: '10px', width: '100%' }}
          >
            Insertion Sort
          </button>
        </div>

        {/* Generate & Start buttons grouped below */}
        <div>
          <button
            disabled={isAnimating || !selectedAlgorithm}
            onClick={startAnimation}
            style={{ margin: '10px 0', padding: '10px', width: '100%' }}
          >
            Start Animation
          </button>
          <button
            disabled={isAnimating}
            onClick={() => generateRandomArray()}
            style={{ margin: '10px 0', padding: '10px', width: '100%' }}
          >
            Generate New Array
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <h3>{selectedAlgorithm ? `Visualizing: ${selectedAlgorithm}` : 'Please select an algorithm to visualize'}</h3>
        <div
          id="visualization"
          style={{
            marginTop: '20px',
            height: '400px',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '4px',
          }}
        >
          {array.map((value, index) => (
            <div
              key={index}
              style={{
                height: `${value * 3}px`,
                width: '20px',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '3px',
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
