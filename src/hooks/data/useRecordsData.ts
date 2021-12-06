import { useEffect, useState } from "react"
import { getAllRecords } from "../../helpers/data"
import { RecordData } from "../../types"

export default function useRecordsData() {
	const [data, setData] = useState<RecordData[] | null>(null)

	async function initiateGetAllRecords() {
		const records = await getAllRecords()

		setData(records)
	}

	useEffect(() => {
		initiateGetAllRecords()
	}, [])

	return data
}
