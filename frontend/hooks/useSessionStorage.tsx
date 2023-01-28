// Taken (and lightly modified) from https://www.30secondsofcode.org/react/s/use-session-storage

import React from "react"

export const useSessionStorage = <T extends any>(
    keyName: string,
    defaultValue: T
) => {
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const value = window.sessionStorage.getItem(keyName)

            if (value) {
                return JSON.parse(value)
            } else {
                window.sessionStorage.setItem(
                    keyName,
                    JSON.stringify(defaultValue)
                )
                return defaultValue
            }
        } catch (err) {
            return defaultValue
        }
    })

    const setValue = (newValue: T) => {
        try {
            window.sessionStorage.setItem(keyName, JSON.stringify(newValue))
        } catch (err) {}
        setStoredValue(newValue)
    }

    return [storedValue, setValue]
}
