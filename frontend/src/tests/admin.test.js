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
import AdjustComponent from '../AdminPage/AdjustComponent';

test('Test Admin', async () => {
  const store = mockStore({
    Stars: { stars: [] },
    BLE: {},
    Constellations: { constellations: [] },
    otherBLE: { coordinates: 0, t_adjust: 0 },
    ListComponent: { coordinates: [{ id: 1, x: 1, y: 1, rpm: 1, wait: 1, lazer: 1 }] }
  });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByText('Admin'));
  fireEvent.click(screen.getByText('Go to XY'));
  fireEvent.click(screen.getByText('Calibrate'));
  fireEvent.click(screen.getByText('Add'));
  fireEvent.click(screen.getByText('Add'));
  fireEvent.click(screen.getByText('Add'));
  fireEvent.click(screen.getByText('Add'));
  fireEvent.click(screen.getByText('Upload'));
  fireEvent.drag(screen.getAllByTestId('RowComponent--Drag')[0], { delta: { x: 0, y: 50 } });
  fireEvent.drag(screen.getAllByTestId('RowComponent--Drag')[0], { delta: { x: 0, y: -50 } });
  fireEvent.drag(screen.getAllByTestId('RowComponent--Drag')[0], { delta: { x: 0, y: -500 } });
  fireEvent.change(screen.getByTestId('type'), { target: { value: 3 } });
  fireEvent.change(screen.getByTestId('laser'), { target: { value: 3 } });
  fireEvent.change(screen.getByTestId('rpm'), { target: { value: 3 } });
  fireEvent.change(screen.getByTestId('wait'), { target: { value: 3 } });
  fireEvent.change(screen.getAllByTestId('RowComponent--Number')[0], { target: { value: 3 } });
});

test('Test AdjustComponent', async () => {
  const store = mockStore({ adjustComponent: { amount: 0 } });
  const app = render(
    <Provider store={store}>
      <BrowserRouter>
        <AdjustComponent />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByTestId('A'));
  fireEvent.click(screen.getByTestId('B'));
  fireEvent.click(screen.getByTestId('C'));
  fireEvent.click(screen.getByTestId('D'));
  fireEvent.click(screen.getByTestId('E'));
});
