import { TransactionWalletOperation } from "@taquito/taquito"
import { NetworkType } from "@airgap/beacon-sdk"

export default async function handleContractResponse(
	op?: TransactionWalletOperation,
	onSuccess?: Function,
	onError?: Function,
	onException?: Function
) {
	if (!op) {
		return
	}

	const operationHash = op.opHash
	const url = NetworkType.GRANADANET + operationHash
	const res = await op.confirmation()
	const status = await op.status()

	if (res.completed) {
		if (status === "applied") onSuccess?.()
		else if (["failed", "backtracked"].includes(status)) onError?.()
		else onException?.(url)
	} else {
		onException?.()
	}
}
