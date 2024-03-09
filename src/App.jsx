import { useReducer } from 'react';
import axios from 'axios';
import { RiFileCopy2Line } from 'react-icons/ri'; 

function App() {
  const initialState = {
    content: '',
    code: '',
    loadedContent: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CONTENT':
        return { ...state, content: action.payload };
      case 'SET_CODE':
        return { ...state, code: action.payload };
      case 'SET_LOADED_CONTENT':
        return { ...state, loadedContent: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { content, code, loadedContent } = state;

  const saveToClipboard = async () => {
    try {
      const response = await axios.post(`https://online-clipboardbackend-1.onrender.com/clipboard`, { content });
      dispatch({ type: 'SET_CODE', payload: response.data.code });
      alert('Content saved to clipboard. Use the following code to retrieve: ' + response.data.code);
    } catch (error) {
      alert('Error saving content.');
    }
  };

  const loadFromClipboard = async () => {
    try {
      const response = await axios.get(`https://online-clipboardbackend-1.onrender.com/clipboard/${code}`);
      dispatch({ type: 'SET_LOADED_CONTENT', payload: response.data.content });
    } catch (error) {
      alert('Error loading clipboard content.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(loadedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="App">
      <h1>Clipboard Tool</h1>

      <div>
        <input
          type="text"
          value={content}
          onChange={(e) => dispatch({ type: 'SET_CONTENT', payload: e.target.value })}
          placeholder="Enter content to save"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveToClipboard();
            }
          }}
        />
        <button onClick={saveToClipboard}>Save to Clipboard</button>
      </div>

      <div>
        <input
          type="text"
          value={code}
          onChange={(e) => dispatch({ type: 'SET_CODE', payload: e.target.value })}
          placeholder="Enter code to load"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              loadFromClipboard();
            }
          }}
        />
        <button onClick={loadFromClipboard}>Load from Clipboard</button>
      </div>

      <div>
        <input
          type="text"
          value={loadedContent}
          onChange={(e) => dispatch({ type: 'SET_LOADED_CONTENT', payload: e.target.value })}
          placeholder="Loaded content"
        />
        <RiFileCopy2Line onClick={copyToClipboard} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default App;
