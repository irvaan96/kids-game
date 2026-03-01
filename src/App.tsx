/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ShapeMatch from './modules/motorik/ShapeMatch';
import ColorMatch from './modules/kognitif/ColorMatch';
import SizeSort from './modules/logika/SizeSort';
import EmotionMatch from './modules/emosi/EmotionMatch';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/play/motorik" element={<ShapeMatch />} />
        <Route path="/play/kognitif" element={<ColorMatch />} />
        <Route path="/play/logika" element={<SizeSort />} />
        <Route path="/play/emosi" element={<EmotionMatch />} />
      </Routes>
    </BrowserRouter>
  );
}
