import '@testing-library/jest-dom';

import { screen, fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import App from '../App';

test('Test AddStar', async () => {
  const store = mockStore({
    Stars: { stars: [] },
    BLE: {},
    Constellations: { constellations: [] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Stars'));
  fireEvent.click(screen.getByText('Add star'));
  fireEvent.click(screen.getByText('Clear'));
  fireEvent.click(screen.getByText('Close'));
  fireEvent.click(screen.getByText('Add star'));
  fireEvent.change(screen.getByTestId('AddStar--Name'), { target: { value: 'TEST STAR' } });
  fireEvent.change(screen.getByTestId('AddStar--Details'), { target: { value: 'TEST STAR' } });
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByText('Save Changes'));
});

test('Test EditStar', async () => {
  const store = mockStore({
    Stars: {
      stars: [{ id: 0, name: '0', additional_info: '0', right_ascension: 0, declination: 0 }]
    },
    BLE: {},
    Constellations: { constellations: [] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Stars'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.click(screen.getByText('Clear'));
  fireEvent.click(screen.getByText('Close'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByTestId('EditStar--Name'), { target: { value: 'TEST STAR' } });
  fireEvent.change(screen.getByTestId('EditStar--Details'), { target: { value: 'TEST STAR' } });
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByText('Upload'));
});

test('Test DeleteStar', async () => {
  const store = mockStore({
    Stars: {
      stars: [{ id: 0, name: '0', additional_info: '0', right_ascension: 0, declination: 0 }]
    },
    BLE: {},
    Constellations: { constellations: [] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Stars'));
  fireEvent.click(screen.getByTestId('StarRow--Delete'));
  fireEvent.click(screen.getByTestId('StarRow--Delete'));
});
