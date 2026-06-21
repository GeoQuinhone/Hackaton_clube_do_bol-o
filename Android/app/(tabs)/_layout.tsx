import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { useEffect } from "react";
import { COLORS, SHADOW, FONTS, FONT_SIZE } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/States";

export default function TabsLayout() {
    const { user, bootstrapping } = useAuth();

    useEffect(() => {
        if (!bootstrapping && !user) {
            router.replace("/login");
        }
    }, [bootstrapping, user]);

    if (bootstrapping) {
        return <LoadingState label="Carregando sua conta..." />;
    }

    if (!user) {
        return null;
    }
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.green,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.label,
                tabBarStyle: [styles.tabBar, SHADOW.md],
                tabBarItemStyle: styles.tabItem,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Início",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon name={focused ? "home" : "home-outline"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="matches"
                options={{
                    title: "Partidas",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon name={focused ? "football" : "football-outline"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="guesses"
                options={{
                    title: "Palpites",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon name={focused ? "checkmark-circle" : "checkmark_circle-outline"} color={color} size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="ranking"
                options={{
                    title: "Ranking",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon name={focused ? "trophy" : "trophy-outline"} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabIcon name={focused ? "person" : "person-outline"} color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

function TabIcon ({
    name, color, size
}: {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    size: number;
}) {
    return (
        <View style={styles.iconWrapper}>
            <Ionicons name={name} size={size -2} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 0,
        height: Platform.OS === "ios" ? 86:66,
        paddingTop: 8,
        paddingBottom: Platform.OS === "ios" ? 28 : 10,
    },
    tabItem: {
        paddingTop: 2,
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontFamily: FONTS.semiBold,
        fontSize: FONT_SIZE.xs,
    },
})