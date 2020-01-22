import * as XMLBuilder from 'xmlbuilder'

export abstract class MosMessage {

	private static MAX_MESSAGE_ID = Math.pow(2, 31) - 2
	private static _messageID: number = 1

	mosID: string
	ncsID: string
	port: string

	private _messageID: number

	private static getNewMessageID (): number {
		// increments and returns a signed 32-bit int counting from 1, resetting to 1 when wrapping
		MosMessage._messageID++
		if (MosMessage._messageID >= MosMessage.MAX_MESSAGE_ID) MosMessage._messageID = 1
		return MosMessage._messageID
	}

  /** */
	prepare (messageID?: number) {
		if (!this.mosID) throw new Error(`Can't prepare message: mosID missing`)
		if (!this.ncsID) throw new Error(`Can't prepare message: ncsID missing`)
		// if (!this.port) throw new Error(`Can't prepare message: port missing`)
		this._messageID = (messageID ? messageID : MosMessage.getNewMessageID())
	}

  /** */
	get messageID (): number {
		return this._messageID
	}

  /** */
	toString (): string {
		let xml = XMLBuilder.create('mos', undefined, undefined, {
			headless: true
		})
		xml.ele('ncsID', this.ncsID)
		xml.ele('mosID', this.mosID)
		xml.ele('messageID', this.messageID)
		xml.importDocument(this.messageXMLBlocks)

		return xml.end({ pretty: true })
	}

  /** */
	protected abstract get messageXMLBlocks (): XMLBuilder.XMLElement

   /**  */
}
