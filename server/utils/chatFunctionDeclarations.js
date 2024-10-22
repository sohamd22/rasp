const selectUsersFunctionDeclaration = {
    name: "selectUsers",
    parameters: {
        type: "OBJECT",
        description: "Select users that match the query.",
        properties: {
            userGoogleIds: {
                type: "ARRAY",
                description: "Google IDs of the matching users.",
                items: {
                    type: "STRING",
                    description: "A google ID."
                }
            },
        },
        required: ["userGoogleIds"],
    },
};

export default [ selectUsersFunctionDeclaration ];