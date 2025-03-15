# Web Canvas Draw Chrome Extension

A Chrome extension that allows you to draw shapes and freehand drawings on any webpage.

## Features

- Multiple drawing tools:
  - Line drawing
  - Circle drawing
  - Rectangle drawing
  - Freehand drawing
- Clear all drawings with one click
- Undo last drawing with Ctrl+Z
- Works on any webpage
- Non-intrusive: Only activates when drawing tools are selected

## Installation

1. Clone this repository or download the files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon to open the drawing toolbar
2. Select a drawing tool (Line, Circle, Rectangle, or Freehand)
3. Click and drag on the webpage to draw
4. Use the Clear button to remove all drawings
5. Press Ctrl+Z to undo the last drawing

## Technical Details

The extension uses HTML5 Canvas for drawing and implements the following:
- Content script injection for drawing functionality
- Custom keyboard shortcuts for undo operations
- Event handling for mouse interactions
- Stack-based drawing history for undo operations 