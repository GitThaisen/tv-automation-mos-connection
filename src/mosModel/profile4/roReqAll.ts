import * as XMLBuilder from 'xmlbuilder'
import { MosMessage } from '../MosMessage'

export class ROReqAll extends MosMessage {

  /** */
	constructor () {
		super()
		this.port = 'upper'
	}

  /** */
	get messageXMLBlocks (): XMLBuilder.XMLElement {
		let root = XMLBuilder.create('roReqAll')
		return root
	}
}
