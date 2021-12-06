import { detectWallet } from "../../helpers/wallet"
import { toast } from "react-toastify"
import handleContractResponse from "../../helpers/wallet/contractResponseHandler"

export default async function markDose(
	adhaar: number,
	dose: number,
	onRequestSent?: Function,
	onSuccess?: Function,
	onError?: Function,
	onException?: Function
) {
	const walletConnected = await detectWallet()
	if (!walletConnected) throw new Error("Could not connect wallet")

	toast.info("Calling mark dose endpoint")
	const contract = await window.tezos?.wallet.at(
		"KT1Fis5ntrcgTordjthYScthSsneW7GevjvQ"
	)

	try {
		toast.info("Please approve the transaction")
		const op = await contract?.methods.mark_dose(adhaar, dose).send()

		toast.info("Your mark dose transaction is being injected. please wait..")
		onRequestSent?.()
		await handleContractResponse(op, onSuccess, onError, onException)
		toast.success("Mark dose transaction has been successful")
	} catch (error) {
		toast.error("Failed to mark dose")
		console.error(error)
		onError?.(error)
	}
}
