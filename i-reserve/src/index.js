import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { BookingWebsite } from './booking-website';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>

			<Provider store={store}>
				<BookingWebsite />
			</Provider>
		
	</BrowserRouter>,
);
