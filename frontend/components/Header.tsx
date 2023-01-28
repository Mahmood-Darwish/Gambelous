import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from "wagmi"
import { notifyType, useNotification } from "web3uikit"
import { icon } from "../public/index"

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
            position: "bottomR",
        })
    }

    if (isConnected) {
        return (
            <div className="header">
                <div>
                    <h4 style={{ margin: "1px" }}>
                        {ensName && `ENS Name: ${ensName}`}
                    </h4>
                    <h5 style={{ margin: "1px" }}>{`Address: ${address}`}</h5>
                    <h6 style={{ margin: "1px" }}>
                        {connector?.name && `Connected to ${connector?.name}`}
                    </h6>
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
                <div className="logo">
                    <h1 style={{ marginRight: "1.0rem", marginTop: "1.0rem" }}>
                        Gambelous
                    </h1>
                    <img src={icon.src} alt="Gambelous" height="100px" />
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: "flex" }}>
            {connectors.map((connector) => (
                <button
                    style={{ marginLeft: "5px", marginRight: "5px" }}
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
            <div className="logo">
                <h1 style={{ marginRight: "1.0rem", marginTop: "1.0rem" }}>
                    Gambelous
                </h1>
                <img src={icon.src} alt="Gambelous" height="100px" />
            </div>
        </div>
    )
}
