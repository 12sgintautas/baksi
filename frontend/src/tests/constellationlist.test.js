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

test('Test AddConstellation', async () => {
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
  fireEvent.click(screen.getByText('Constellations'));
  fireEvent.click(screen.getByText('Add constellation'));
  fireEvent.click(screen.getByText('Clear'));
  fireEvent.click(screen.getByText('Close'));
  fireEvent.click(screen.getByText('Add constellation'));
  fireEvent.change(screen.getByTestId('AddConstellation--Name'), {
    target: { value: 'TEST STAR' }
  });
  fireEvent.change(screen.getByTestId('AddConstellation--Details'), {
    target: { value: 'TEST STAR' }
  });
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.drag(screen.getAllByTestId('AddConstellation--StarRow')[0], { delta: { x: 0, y: 50 } });
  fireEvent.drag(screen.getAllByTestId('AddConstellation--StarRow')[0], {
    delta: { x: 0, y: -50 }
  });
  fireEvent.click(screen.getAllByTestId('AddConstellation--RemoveStar')[0]);
  fireEvent.click(screen.getByText('Save Changes'));
});

test('Test EditConstellation', async () => {
  const store = mockStore({
    Stars: {
      stars: [{ id: 0, name: '0', additional_info: '0', right_ascension: 0, declination: 0 }]
    },
    BLE: {},
    Constellations: { constellations: [{ id: 0, name: '0', additional_info: '0', stars: [0] }] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Constellations'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.click(screen.getByText('Clear'));
  fireEvent.click(screen.getByText('Close'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByTestId('EditConstellation--Name'), {
    target: { value: 'TEST STAR' }
  });
  fireEvent.change(screen.getByTestId('EditConstellation--Details'), {
    target: { value: 'TEST STAR' }
  });
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.click(screen.getByTestId('StarMap--Map'));
  fireEvent.drag(screen.getAllByTestId('AddConstellation--StarRow')[0], { delta: { x: 0, y: 50 } });
  fireEvent.drag(screen.getAllByTestId('AddConstellation--StarRow')[0], {
    delta: { x: 0, y: -50 }
  });
  fireEvent.click(screen.getAllByTestId('AddConstellation--RemoveStar')[0]);
});

test('Test DeleteConstellation', async () => {
  const store = mockStore({
    Stars: { stars: [] },
    BLE: {},
    Constellations: { constellations: [{ id: 0, name: '0', additional_info: '0' }] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Constellations'));
  fireEvent.click(screen.getByTestId('ConstellationRow--Delete'));
});
