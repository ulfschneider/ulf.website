const DEFAULT_X_SWIPE_THRESHOLD_PX = 50;
const DEFAULT_Y_SWIPE_THRESHOLD_PX = 50;
const DEFAULT_MAX_DURATION_SEC = .5;

let gesture = {
  startX: 0,
  endX: 0,
  startY: 0,
  endY: 0,
  startTime: 0,
  endTime: 0,
  upSwipes: [],
  downSwipes: [],
  leftSwipes: [],
  rightSwipes: []
}

function xSwipe(xMove) {
  if (xMove < 0) {
    for (let swipe of gesture.leftSwipes) {
      if (Math.abs(xMove) >= swipe.thresholdPx) {
        swipe.handler(Math.abs(xMove));
      }
    }
  } else if (xMove > 0) {
    for (let swipe of gesture.rightSwipes) {
      if (Math.abs(xMove) >= swipe.thresholdPx) {
        swipe.handler(Math.abs(xMove));
      }
    }
  }
}

function ySwipe(yMove) {
  if (yMove < 0) {
    for (let swipe of gesture.upSwipes) {
      if (Math.abs(yMove) >= swipe.thresholdPx) {
        swipe.handler(Math.abs(yMove));
      }
    }
  } else if (yMove > 0) {
    for (let swipe of gesture.downSwipes) {
      if (Math.abs(yMove) >= swipe.thresholdPx) {
        swipe.handler(Math.abs(yMove));
      }
    }
  }
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
    ySwipe(yMove);
  } else if (Math.abs(xMove) > Math.abs(yMove)) {
    xSwipe(xMove)
  }
}

function onSwipeUp(handler, thresholdPx = DEFAULT_Y_SWIPE_THRESHOLD_PX) {
  gesture.upSwipes.push({ handler: handler, thresholdPx: thresholdPxl });
}

function onSwipeDown(handler, thresholdPx = DEFAULT_Y_SWIPE_THRESHOLD_PX) {
  gesture.downSwipes.push({ handler: handler, thresholdPx: thresholdPx });
}

function onSwipeLeft(handler, thresholdPx = DEFAULT_X_SWIPE_THRESHOLD_PX) {
  gesture.leftSwipes.push({ handler: handler, thresholdPx: thresholdPx });
}

function onSwipeRight(handler, thresholdPx = DEFAULT_X_SWIPE_THRESHOLD_PX) {
  gesture.rightSwipes.push({ handler: handler, thresholdPx: thresholdPx });
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
