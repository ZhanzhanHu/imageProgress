(function (w) {

  var imgs = [],
    progress, complete,
    time = new Date().getTime();

  function preLoadImg(options) {
    var path = options.path;
    progress = options.progress || function () {};
    complete = options.complete || function () {};
    path = path.charAt(path.length - 1) == '/' ? path : path + '/';
    options.data.forEach(function (value, index) {
      imgs.push({
        url: path + value,
        loadedSize: 0,
        totalSize: 1 //分母
      });
    });
    if (options.queue) {
      queueLoadImage();
    } else {
      noQueueLoadImage();
    }
  }

  function queueLoadImage() {
    loadSingleImage(0, queueLoadImageCallback);
  }

  function queueLoadImageCallback(index, loaded, total) {
    imgs[index].loadedSize = loaded;
    imgs[index].totalSize = total;
    calculateProgress();
    if (loaded == total) {
      if (imgs[++index]) {
        loadSingleImage(index, queueLoadImageCallback);
      } else {
        complete && complete(new Date().getTime() - time);
      }
    }
  }

  function noQueueLoadImage() {
    imgs.forEach(function (value, index) {
      loadSingleImage(index, noQueueLoadImageCallback);
    });
  }

  function noQueueLoadImageCallback(index, loaded, total) {
    imgs[index].loadedSize = loaded;
    imgs[index].totalSize = total;
    calculateProgress();
    var loadedImgCount = 0;
    imgs.forEach(function (value, index) {
      if (value.loadedSize == value.totalSize) {
        loadedImgCount++;
      }
    });
    loadedImgCount == imgs.length && complete && complete(new Date().getTime() - time);
  }

  function calculateProgress() {
    var sum = imgs.map(function (value, index) {
      return value.loadedSize / (value.totalSize * imgs.length) * Math.pow(10, 2);
    });
    sum = sum.reduce(function (a, b) {
      return a + b;
    });
    sum = Math.round(sum) + '%';
    progress && progress(sum);
  }

  function loadSingleImage(index, callback) {
    var img = imgs[index],
      xhr = new XMLHttpRequest();
    xhr.onprogress = function (event) {
      event.lengthComputable && callback && callback(index, event.loaded, event.total);
    };
    xhr.open('GET', img.url, true);
    xhr.send();
  }

  w.preLoadImg = preLoadImg;

})(window)

preLoadImg({
  data: [
    "eat-1.png",
    "buy-1.png",
    "buy-2.png",
    "buy-3.png",
    "buy-4.png",
    "eat-2.png",
    "eat-3.png",
    "eat-4.png",
    "fun-1.png",
    "fun-2.png",
    "fun-3.png",
    "fun-4.png",
    "home-bg.png",
    "home-buy.png",
    "home-eat.png",
    "home-fun.png",
    "home-icon.png",
    "home-rest.png",
    "logo.png",
    "logo_page.png",
    "rest-1.png",
    "rest-2.png",
    "rest-3.png",
    "rest-4.png",
  ],
  path: 'http://temp.imluxin.com/frontend/czgy/image/',
  // queue: false,
  queue: true,
  progress: function (percent) {
    console.log(percent);
  },
  complete: function (time) {
    console.log(time);
  }
});

