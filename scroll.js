alert("HELLO FROM SCROLLL!");
document.body.innerHTML = "hello!";
setTimeout(() => {
  alert("AFTER TIMEOUT!");
}, 1000);
//   // const initiateScroll = () => {
//   //   alert("SCROLL almost initiated!");
//   //   const doScroll = () => {
//   //     alert("BEFORE SCROLL!");
//   //     const newTop =
//   //       (document.documentElement.clientHeight - 300) * scrollCount;
//   //     const top = Math.min(newTop, document.body.scrollHeight);
//   //     window.scrollTo({ left: 0, top, behavior: "smooth" });
//   //     scrollCount++;
//   //   };
//   //   scrollInterval = setInterval(doScroll, 5000);
