const DEFAULT_X_SWIPE_THRESHOLD_PIXEL = 100;

let gesture = {
  startX: 0,
  endX: 0,
  leftSwipes: [],
  rightSwipes: []
}

function handleSwipe() {
  let move = gesture.endX - gesture.startX;
  if (move < 0) {
    for (let swipe of gesture.leftSwipes) {
      if (Math.abs(move) >= swipe.threshold) {
        swipe(Math.abs(move));
      }
    }
  } else {
    for (let swipe of gesture.rightSwipes) {
      if (Math.abs(move) >= swipe.threshold) {
        swipe(Math.abs(move));
      }
    }
  }
}

function onSwipeLeft(handler, thresholdPixel = DEFAULT_X_SWIPE_THRESHOLD_PIXEL) {
  gesture.leftSwipes.push({ handler: handler, thresholdPixel: thresholdPixel });
}

function onSwipeRight(handler, thresholdPixel = DEFAULT_X_SWIPE_THRESHOLD_PIXEL) {
  gesture.rightSwipes.push({ handler: handler, thresholdPixel: thresholdPixel });
}

addEventListener('touchstart', event => {
  if (event.touches.length == 1) {
    gesture.startX = event.changedTouches[0].screenX;
  }
});

addEventListener('touchend', event => {
  if (event.touches.length == 1) {
    gesture.endX = event.changedTouches[0].screenX;
    handleSwipe();
  }
});
