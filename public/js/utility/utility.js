function formatShow(data) {
  if (data) {
    return moment.utc(data * 1000).format("HH:mm:ss");
  }
  return moment.utc(0 * 1000).format("HH:mm:ss");
}

function notification(title, message) {
  notifier.notify({
    title,
    message
  });
}
