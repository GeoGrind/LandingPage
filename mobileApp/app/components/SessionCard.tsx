import { View, Text, StyleSheet } from "react-native";
import { Card, ListItem, Image } from "react-native-elements";
import { Session } from "../types";

import * as React from "react";

declare module "react-native-elements" {
  export interface CardProps {
    children?: React.ReactNode;
  }
}

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const {
    course,
    startTime,
    isVisible,
    sessionStartLocation,
    numberOfCheerers,
    cheerers,
  } = session;

  return (
    <Card>
      <View>
        {/* Course Name */}
        <Text style={styles.courseText}>{course}</Text>

        {/* Session Time */}
        <Text style={styles.startTimeText}>Start Time: {startTime}</Text>

        {/* Session Start Location */}
        <Text style={styles.locationText}>Location:</Text>

        {/* Number of Cheerers */}
        <Text style={styles.cheerersText}>
          {numberOfCheerers} Cheerers{" "}
          {cheerers && cheerers.length > 0
            ? "(" + cheerers.join(", ") + ")"
            : ""}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  courseText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  startTimeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cheerersText: {
    fontSize: 14,
    color: "#888",
  },
});

export default SessionCard;
