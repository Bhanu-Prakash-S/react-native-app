import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Videolesson() {
  // Replace with your own playback ID from https://dashboard.mux.com
  const playbackId = "iGLJIlscMNe00OLBkTiLEGPOsz44Ubbu6RGXUdC9OeUs";
  const videoSource = `https://stream.mux.com/${playbackId}.m3u8`;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsPictureInPicture
        nativeControls
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#afe7f1",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
});
