import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import Menu from '../Menu';

test('Test Menu Renders', async () => {
  const store = mockStore({ BLE: {} });
  const dispatch = store.dispatch;
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText('Laser speed:')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Connect'));
  fireEvent.click(screen.getByText('Disconnect'));
  fireEvent.change(screen.getByTestId('Menu--RPM'), { target: { value: 4 } });
  fireEvent.change(screen.getByTestId('Menu--MType'), { target: { value: 2 } });
  fireEvent.change(screen.getByTestId('Menu--Wait'), { target: { value: 400 } });
});
