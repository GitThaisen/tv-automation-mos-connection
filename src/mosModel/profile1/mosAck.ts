import * as XMLBuilder from 'xmlbuilder'
import { MosString128 } from '../../dataTypes/mosString128'
import { MosMessage } from '../MosMessage'
import {
	IMOSAck,
	IMOSAckStatus
} from '../../api'

export class MOSAck extends MosMessage implements IMOSAck {

	ID: MosString128
	Revision: Number // max 999
	Status: IMOSAckStatus
	Description: MosString128

  /** */
	constructor () {
		super()
	}

  /** */
	get messageXMLBlocks (): XMLBuilder.XMLElement {
		let root = XMLBuilder.create('mosAck')

		root.ele('objID', {}, this.ID.toString())
		root.ele('objRev', {}, this.Revision)
		root.ele('status', {}, (IMOSAckStatus as any)[this.Status])
		root.ele('statusDescription', {}, this.Description.toString())

		return root
	}
}
