const DEFAULT_X_SWIPE_THRESHOLD_PX = 50;
const DEFAULT_MAX_DURATION_SEC = .5;

let gesture = {
  startX: 0,
  endX: 0,
  startY: 0,
  endY: 0,
  startTime: 0,
  endTime: 0,
  leftSwipes: [],
  rightSwipes: []
}

function handleSwipe() {
  let duration = gesture.endTime - gesture.startTime;
  if (duration > 500) {
    //the gesture took too long
    return;
  }

  let xMove = gesture.endX - gesture.startX;
  let yMove = gesture.endY - gesture.startY;
  if (Math.abs(xMove) < Math.abs(yMove)) {
    //this is a vertical swipe, we will not take care
    return;
  }

  if (xMove < 0) {
    for (let swipe of gesture.leftSwipes) {
      if (Math.abs(xMove) >= swipe.thresholdPixel) {
        swipe.handler(Math.abs(xMove));
      }
    }
  } else if (xMove > 0) {
    for (let swipe of gesture.rightSwipes) {
      if (Math.abs(xMove) >= swipe.thresholdPixel) {
        swipe.handler(Math.abs(xMove));
      }
    }
  }
}

function onSwipeLeft(handler, thresholdPixel = DEFAULT_X_SWIPE_THRESHOLD_PX) {
  gesture.leftSwipes.push({ handler: handler, thresholdPixel: thresholdPixel });
}

function onSwipeRight(handler, thresholdPixel = DEFAULT_X_SWIPE_THRESHOLD_PX) {
  gesture.rightSwipes.push({ handler: handler, thresholdPixel: thresholdPixel });
}

addEventListener('touchstart', event => {
  gesture.startTime = Date.now();
  gesture.startX = event.changedTouches[0].screenX;
  gesture.startY = event.changedTouches[0].screenY;
});

addEventListener('touchend', event => {
  gesture.endTime = Date.now();
  gesture.endX = event.changedTouches[0].screenX;
  gesture.endY = event.changedTouches[0].screenY;
  handleSwipe();
});
