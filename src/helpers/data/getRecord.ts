import axios from "axios"
import { RecordData, UncleanRecordData } from "../../types"
const URL = "https://api.hangzhou2net.tzkt.io/v1/bigmaps/22284/keys"

export default async function getRecord(
	adhaar: number
): Promise<RecordData | false> {
	const { data } = await axios.get<UncleanRecordData[]>(`${URL}?key=${adhaar}`)
	const cleanedData = parseRecordsData(data)
	return cleanedData[0] || false
}

function parseRecordsData(records: UncleanRecordData[]) {
	return records.map(uncleanRecord => cleanRecordData(uncleanRecord))
}

function cleanRecordData(record: UncleanRecordData): RecordData {
	return record.value
}
