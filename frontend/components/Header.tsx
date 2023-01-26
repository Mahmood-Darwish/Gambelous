import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from "wagmi"
import { notifyType, useNotification } from "web3uikit"

export default function Header() {
    const { address, connector, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect()
    const dispatch = useNotification()

    const handleNewNotification = (
        type: notifyType,
        title: string,
        message: string
    ) => {
        dispatch({
            type,
            message: message,
            title: title,
            position: "topR",
        })
    }

    if (isConnected) {
        return (
            <div>
                <div>{ensName ? `${ensName} (${address})` : address}</div>
                <div>Connected to {connector?.name}</div>
                <button
                    onClick={() => {
                        try {
                            disconnect()
                            handleNewNotification(
                                "info",
                                "Disconnected",
                                `You're disconnected from ${connector?.name}!`
                            )
                        } catch (e) {
                            handleNewNotification(
                                "error",
                                "Problem Disconnecting",
                                `Unable to disconnect from ${connector?.name}! Error message: ${e}`
                            )
                        }
                    }}
                >
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <div>
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => {
                        try {
                            connect({ connector })
                            handleNewNotification(
                                "success",
                                "New Connection",
                                `You're connected to ${connector.name} now!`
                            )
                        } catch (e) {
                            handleNewNotification(
                                "error",
                                "Problem Connecting",
                                `Unable to connect to ${connector?.name}! Error message: ${e}`
                            )
                        }
                    }}
                >
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        " (connecting)"}
                </button>
            ))}

            {error && <div>{error.message}</div>}
        </div>
    )
}
