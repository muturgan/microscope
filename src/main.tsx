import '@xyflow/react/dist/style.css';
import './styles/mobile.css';

import { h, render } from 'preact';

import { App } from './app';

// body — корневой контейнер приложения, поэтому App рендерит фрагмент без обёртки.
render(<App />, document.body);
