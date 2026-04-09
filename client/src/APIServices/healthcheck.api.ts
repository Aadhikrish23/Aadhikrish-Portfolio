import apiClient from "../utils/axios";

const healthCheck = async () => {
    const health = await apiClient.get("/health");
    return health;
}

export default{healthCheck}