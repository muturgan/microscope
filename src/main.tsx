import '@xyflow/react/dist/style.css';
import './style.css';

import { h, render } from 'preact';

import { App } from './app';

// body — корневой контейнер приложения, поэтому App рендерит фрагмент без обёртки.
render(<App />, document.body);
