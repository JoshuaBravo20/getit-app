import PushNotification from "react-native-push-notification";

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotification.FetchResult.NoData);
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.popInitialNotification((notification) => {
  console.log("Initial Notification", notification);
});

PushNotification.getChannels(function (channel_ids) {
  console.log("channel ids ", channel_ids); // ['channel_id_1']
});
