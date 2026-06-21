export const COLORS = {
    //Marca
    navy:"#0F1F3D",
    navyLight:"#1B2F57",
    navyDark:"#0A1429",
    green:"#22c55e",
    greenLight:"#4ADE80",
    greenDark:"#15803D",
    gold:"#F5b731",

    //Superficies
    backgroud: "#F4F6FB",
    surface:"#FFFFFF",
    surfaceAlt: "#EEF1F8",
    border: "#E2E6F0",

    //Texto
    textPrimary: "#101828",
    textSecondary: "#5A6478",
    textMuted: "#94A0B8",
    textOnDark: "#FFFFFF",
    textonDarkMuted: "#B9C3DE",

    //Estado e o feedback
    sucess: "#22C55E",
    sucessBg:"#E7F9EE",
    danger: "#E5484D",
    dangerBg: "#FCE9EA",
    warning: "#F5B731",
    warningBg: "#FEF6E3",
    info: "#2563EB",
    infoBg: "#E8EFFD",

    //Pontuação 
    rankGold: "#F5B731",
    rankSilver:"#B9C0CC",
    rankBronze:"#C77B43",

    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(15,31,61,0.55)",
};

export const GRADIENTS = {
    primary: [COLORS.navy, COLORS.navyLight] as const,
    field: [COLORS.greenDark, COLORS.green] as const,
    hero:["#0A1429", "#16284D", "#1B3A63"] as const,
    gold:["#F5B731", "#E69A1C"] as const,
    cardDark:["#142347", "#0F1F3D"] as const,
};

export const RADIUS = {
    sm: 8, md:12, lg:16, xl:22, pill:999,
};

export const SPACING = {
    xs: 4, sm: 8, md: 12, lg:16, xl:24, xxl:32,
};

export const FONTS = {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extraBold: "Inter_800ExtraBold",
};

export const FONT_SIZE = {
    xs: 11, sm: 13, md:15, lg: 17, xl:20, xxl: 26, display: 32,
};

export const SHADOW = {
    sm: {
        shadowColor: COLORS.navy,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    
    md: {
        shadowColor: COLORS.navy,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 14,
        elevation: 6,
    },

    lg: {
        shadowColor: COLORS.navy,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.16,
        shadowRadius: 24,
        elevation: 10,
    },
};

//Cores por fase do campeonato *usado em badges*
export const PHASE_LABEL: Record<string, string> = {
    GRUPOS: "Fase de Grupos",
    OITAVAS: "Oitavas de Final",
    QUARTAS: "Quartas de Final",
    SEMI: "Semifinal",
    FINAL: "Final",
};

export const STATUS_LABEL: Record<string, string> = {
    AGENDADA: "Agendada",
    EM_ANDAMENTO: "Ao vivo",
    ENCERRADA: "Encerrada"
};