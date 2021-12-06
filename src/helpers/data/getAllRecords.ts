import axios from "axios"
import { RecordData, UncleanRecordData } from "../../types"
const URL = "https://api.hangzhou2net.tzkt.io/v1/bigmaps/22284/keys"

export default async function getAllRecords(): Promise<RecordData[]> {
	const { data } = await axios.get<UncleanRecordData[]>(URL)
	const cleanedData = parseRecordsData(data)
	return cleanedData
}

function parseRecordsData(records: UncleanRecordData[]) {
	return records.map(uncleanRecord => cleanRecordData(uncleanRecord))
}

function cleanRecordData(record: UncleanRecordData): RecordData {
	return record.value
}
