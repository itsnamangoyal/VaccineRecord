import { ColorMode, NetworkType } from "@airgap/beacon-sdk"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit } from "@taquito/taquito"
import axios from "axios"
import { toast } from "react-toastify"

// need this to add definiton of tezos and wallet to windows
declare global {
	interface Window {
		tezos?: TezosToolkit
		wallet?: BeaconWallet
	}
}

const NODE_URL = "https://rpc.hangzhounet.teztnets.xyz/"

/**
 * Checks if a node is reponsive or not and returns a boolean repressnting so
 * @param {String} nodeUrl url of the node
 * @returns {Promise<Boolean>} is node responsive
 */
async function isNodeResponsive(nodeUrl: string): Promise<boolean> {
	try {
		const response = await axios({
			method: "get",
			baseURL: nodeUrl,
			timeout: 1000 * 5,
			url: "chains/main/blocks",
		})
		return response.status === 200
	} catch (error) {
		return false
	}
}

async function createNewTezosWalletInstance() {
	try {
		if (await isNodeResponsive(NODE_URL)) {
			window.tezos = new TezosToolkit(NODE_URL)
			return true
		} else {
			toast.error("Node seems loaded at the moment. Please try again later.")
		}
		return false
	} catch (error) {
		console.error(`Could not create new Tezos wallet instance.`, error)
		toast.error("Could not create new Tezos wallet instance")
		return false
	}
}

/**
 * Create a new beacon wallet instance
 * @param {object} args
 * @param {string} args.name name for the app
 * @param {string} args.preferredNetwork network to connect wallet to
 * @param {string} args.ColorMode color mode for the wallet) wallet instance
 * @type {BeaconWallet}
 */
function createNewBeaconWalletInstance({
	name = "Vaccine Record",
	preferredNetwork = NetworkType.HANGZHOUNET,
	colorMode = ColorMode.DARK,
	// matrixNodes = ["rpc.kaizen.teztnets.xyz"],
}) {
	return new BeaconWallet({
		name,
		preferredNetwork,
		colorMode,
		// matrixNodes,
	})
}

/**
 * checks if wallet is connected and connects if not present
 * @param {boolean} initiateConnection boolean value to initiate a new wallet connection if not found
 * @returns {Promise<boolean>} Boolean value indicating if connection is successful or not
 */
export default async function detectWallet(
	initiateConnection: boolean = true
): Promise<boolean> {
	// check if wallet instance already exists
	if (!window.tezos) {
		try {
			const res = await createNewTezosWalletInstance()
			if (!res) {
				return false
			}
		} catch (error) {
			console.error(error)
			toast.error("Failed to make a new TezosToolkit Instance because ")
		}
	}
	if (!window.wallet) {
		// create a new instance. This would be helpful when a new connection is actually requested and no instance already exists
		window.wallet = createNewBeaconWalletInstance({})
	}
	// this would get us previously stored account if there is one

	const activeAccount = await window.wallet.client.getActiveAccount()

	// this would mean no account was previously saved/connected
	if (!activeAccount) {
		// if we are not allowed to initiate a new connection then we just return false.
		if (!initiateConnection) {
			return false
		}

		try {
			// this would not reject or resolve promise if Beacon popup is closed by user.
			// That could cause multiple instance issue
			await window.wallet.client.requestPermissions({
				network: { type: NetworkType.HANGZHOUNET },
			})
		} catch (error) {
			console.warn("Error while requesting permissions on the wallet")
			console.error(error)
			toast.error(`Could not connet to the wallet.`)
			return false
		}
	}

	window.tezos?.setWalletProvider(window.wallet)

	return true
}
