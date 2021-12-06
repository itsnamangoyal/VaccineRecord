import { detectWallet } from "../../helpers/wallet"
import { toast } from "react-toastify"
import handleContractResponse from "../../helpers/wallet/contractResponseHandler"

export default async function registerUser(
	adhaar: number,
	onRequestSent?: Function,
	onSuccess?: Function,
	onError?: Function,
	onException?: Function
) {
	const walletConnected = await detectWallet()
	if (!walletConnected) throw new Error("Could not connect wallet")

	toast.info("Calling register user endpoint")

	const contract = await window.tezos?.wallet.at(
		"KT1Fis5ntrcgTordjthYScthSsneW7GevjvQ"
	)

	try {
		toast.info("Please approve the transaction")
		const op = await contract?.methods.register_person(adhaar).send()
		onRequestSent?.()
		toast.info(
			"Your register user transaction is being injected. please wait.."
		)
		await handleContractResponse(op, onSuccess, onError, onException)
		toast.success("Register user transaction has been successful")
	} catch (error) {
		toast.error("Failed to register user")
		console.error(error)
		onError?.(error)
	}
}
