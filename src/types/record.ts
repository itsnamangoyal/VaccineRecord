export type UncleanRecordData = {
	active: boolean
	firstLevel: number
	hash: string
	id: number
	key: string
	lastLevel: number
	updates: number
	value: RecordData
}

export type RecordData = {
	dose1: number
	dose1_timestamp: string | null
	dose2: number
	dose2_timestamp: string | null
}
