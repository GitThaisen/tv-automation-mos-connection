"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XMLBuilder = require("xmlbuilder");
const api_1 = require("../api");
const mosString128_1 = require("../dataTypes/mosString128");
const mosTime_1 = require("../dataTypes/mosTime");
const mosDuration_1 = require("../dataTypes/mosDuration");
const index_1 = require("./index");
const util_1 = require("util");
function isEmpty(obj) {
    if (typeof obj === 'object') {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }
    else {
        return !obj;
    }
}
var Parser;
(function (Parser) {
    function xml2ROBase(xml) {
        let ro = {
            ID: new mosString128_1.MosString128(xml.roID),
            Slug: new mosString128_1.MosString128(xml.roSlug)
        };
        if (xml.hasOwnProperty('roEdStart') && !isEmpty(xml.roEdStart))
            ro.EditorialStart = new mosTime_1.MosTime(xml.roEdStart);
        if (xml.hasOwnProperty('roEdDur') && !isEmpty(xml.roEdDur))
            ro.EditorialDuration = new mosDuration_1.MosDuration(xml.roEdDur);
        if (xml.hasOwnProperty('roChannel') && !isEmpty(xml.roChannel))
            ro.DefaultChannel = new mosString128_1.MosString128(xml.roChannel);
        if (xml.hasOwnProperty('roTrigger') && !isEmpty(xml.roTrigger))
            ro.Trigger = new mosString128_1.MosString128(xml.roTrigger);
        if (xml.hasOwnProperty('macroIn') && !isEmpty(xml.macroIn))
            ro.MacroIn = new mosString128_1.MosString128(xml.macroIn);
        if (xml.hasOwnProperty('macroOut') && !isEmpty(xml.macroOut))
            ro.MacroOut = new mosString128_1.MosString128(xml.macroOut);
        if (xml.hasOwnProperty('mosExternalMetadata') && !isEmpty(xml.mosExternalMetadata)) {
            // TODO: Handle an array of mosExternalMetadata
            let meta = {
                MosSchema: xml.mosExternalMetadata.mosSchema,
                MosPayload: xml.mosExternalMetadata.mosPayload
            };
            if (xml.mosExternalMetadata.hasOwnProperty('mosScope'))
                meta.MosScope = xml.mosExternalMetadata.mosScope;
            ro.MosExternalMetaData = [meta];
        }
        return ro;
    }
    Parser.xml2ROBase = xml2ROBase;
    function xml2RO(xml) {
        let stories = xml2Stories(xml.story);
        let ro = xml2ROBase(xml);
        ro.Stories = stories;
        return ro;
    }
    Parser.xml2RO = xml2RO;
    // export function ro2xml (ro: IMOSRunningOrder): XMLBuilder.XMLElementOrXMLNode {
    // 	// too implement
    // 	return XMLBuilder.create('ro')
    // }
    function xml2Stories(xml) {
        if (!xml)
            return [];
        let xmlStories = xml;
        if (!Array.isArray(xmlStories))
            xmlStories = [xmlStories];
        return xmlStories.map((xmlStory) => {
            return xml2Story(xmlStory);
        });
    }
    Parser.xml2Stories = xml2Stories;
    function xml2FullStory(xml) {
        let story0 = xml2Story(xml);
        let story = {
            ID: story0.ID,
            Slug: story0.Slug,
            Number: story0.Number,
            MosExternalMetaData: story0.MosExternalMetaData,
            RunningOrderId: new mosString128_1.MosString128(xml.roID),
            Body: xml2Body(xml.storyBody)
        };
        return story;
    }
    Parser.xml2FullStory = xml2FullStory;
    function xml2Story(xml) {
        let story = {
            ID: new mosString128_1.MosString128(xml.storyID),
            Slug: new mosString128_1.MosString128(xml.storySlug),
            Items: []
            // TODO: Add & test Number, ObjectID, MOSID, mosAbstract, Paths
            // Channel, EditorialStart, EditorialDuration, UserTimingDuration, Trigger, MacroIn, MacroOut, MosExternalMetaData
            // MosExternalMetaData: xml2MetaData(xml.mosExternalMetadata)
        };
        if (xml.hasOwnProperty('item'))
            story.Items = story.Items.concat(xml2Items(xml.item));
        if (xml.hasOwnProperty('storyBody') && xml.storyBody) {
            // Note: the <storyBody> is sent in roStorySend
            if (xml.storyBody.hasOwnProperty('storyItem')) {
                story.Items = story.Items.concat(xml2Items(xml.storyBody.storyItem));
            }
        }
        if (xml.hasOwnProperty('mosExternalMetadata'))
            story.MosExternalMetaData = xml2MetaData(xml.mosExternalMetadata);
        if (xml.hasOwnProperty('storyNum') && !isEmpty(xml.storyNum))
            story.Number = new mosString128_1.MosString128(xml.storyNum || '');
        return story;
    }
    Parser.xml2Story = xml2Story;
    function story2xml(story) {
        let xmlStory = XMLBuilder.create('story');
        xmlStory.ele('storyID', {}, story.ID);
        // if (story.Slug) xmlStory.ele('storySlug', {}, story.)
        if (story.Slug)
            xmlStory.ele('storySlug', {}, story.Slug.toString());
        if (story.Number)
            xmlStory.ele('storyNum', {}, story.Number.toString());
        if (story.MosExternalMetaData) {
            story.MosExternalMetaData.forEach((md) => {
                let xmlMD = metaData2xml(md);
                xmlStory.importDocument(xmlMD);
            });
        }
        story.Items.forEach((item) => {
            let xmlItem = item2xml(item);
            xmlStory.importDocument(xmlItem);
        });
        return xmlStory;
    }
    Parser.story2xml = story2xml;
    function xml2Items(xml) {
        if (!xml)
            return [];
        let xmlItems = xml;
        if (!Array.isArray(xmlItems))
            xmlItems = [xmlItems];
        return xmlItems.map((xmlItem) => {
            return xml2Item(xmlItem);
        });
    }
    Parser.xml2Items = xml2Items;
    function xml2Item(xml) {
        let item = {
            ID: new mosString128_1.MosString128(xml.itemID),
            ObjectID: new mosString128_1.MosString128(xml.objID),
            MOSID: xml.mosID
            // TODO: mosAbstract?: string,
            // TODO: Channel?: MosString128,
            // TODO: MacroIn?: MosString128,
            // TODO: MacroOut?: MosString128,
        };
        if (xml.hasOwnProperty('itemSlug') && !isEmpty(xml.itemSlug))
            item.Slug = new mosString128_1.MosString128(xml.itemSlug);
        if (xml.hasOwnProperty('objPaths'))
            item.Paths = xml2ObjPaths(xml.objPaths);
        if (xml.hasOwnProperty('itemEdStart'))
            item.EditorialStart = xml.itemEdStart;
        if (xml.hasOwnProperty('itemEdDur'))
            item.EditorialDuration = xml.itemEdDur;
        if (xml.hasOwnProperty('itemUserTimingDur'))
            item.UserTimingDuration = xml.itemUserTimingDur;
        if (xml.hasOwnProperty('itemTrigger'))
            item.Trigger = xml.itemTrigger;
        if (xml.hasOwnProperty('mosExternalMetadata'))
            item.MosExternalMetaData = xml2MetaData(xml.mosExternalMetadata);
        if (xml.hasOwnProperty('mosAbstract'))
            item.mosAbstract = xml.mosAbstract + '';
        if (xml.hasOwnProperty('objSlug'))
            item.ObjectSlug = new mosString128_1.MosString128(xml.objSlug);
        if (xml.hasOwnProperty('itemChannel'))
            item.Channel = new mosString128_1.MosString128(xml.itemChannel);
        if (xml.hasOwnProperty('objDur'))
            item.Duration = xml.objDur;
        if (xml.hasOwnProperty('objTB'))
            item.TimeBase = xml.objTB;
        if (xml.hasOwnProperty('macroIn'))
            item.MacroIn = new mosString128_1.MosString128(xml.macroIn);
        if (xml.hasOwnProperty('macroOut'))
            item.MacroOut = new mosString128_1.MosString128(xml.macroOut);
        if (xml.hasOwnProperty('mosObj')) {
            // Note: the <mosObj> is sent in roStorySend
            item.MosObjects = xml2MosObjs(xml.mosObj);
        }
        return item;
    }
    Parser.xml2Item = xml2Item;
    function xml2ObjPaths(xml) {
        if (!xml)
            return [];
        let paths = [];
        let xmlPaths = [];
        Object.keys(xml).forEach((key) => {
            let arr = xml[key];
            if (!Array.isArray(arr))
                arr = [arr];
            arr.forEach((o) => {
                xmlPaths.push({
                    key: key,
                    o: o
                });
            });
        });
        xmlPaths.forEach((xmlPath) => {
            let type = null;
            if (xmlPath.key === 'objPath') {
                type = api_1.IMOSObjectPathType.PATH;
            }
            else if (xmlPath.key === 'objProxyPath') {
                type = api_1.IMOSObjectPathType.PROXY_PATH;
            }
            else if (xmlPath.key === 'objMetadataPath') {
                type = api_1.IMOSObjectPathType.METADATA_PATH;
            }
            const isObj = util_1.isObject(xmlPath.o);
            if (type && isObj && Object.keys(xmlPath.o).length > 0) {
                paths.push({
                    Type: type,
                    Description: xmlPath.o.techDescription || (xmlPath.o.attributes ? xmlPath.o.attributes.techDescription : undefined),
                    Target: xmlPath.o.text || xmlPath.o.$t
                });
            }
        });
        return paths;
    }
    Parser.xml2ObjPaths = xml2ObjPaths;
    function objPaths2xml(paths) {
        let xmlObjPaths = XMLBuilder.create('objPaths');
        paths.forEach((path) => {
            if (path.Type === api_1.IMOSObjectPathType.PATH) {
                xmlObjPaths.ele('objPath', {
                    techDescription: path.Description
                }, path.Target);
            }
            else if (path.Type === api_1.IMOSObjectPathType.PROXY_PATH) {
                xmlObjPaths.ele('objProxyPath', {
                    techDescription: path.Description
                }, path.Target);
            }
            else if (path.Type === api_1.IMOSObjectPathType.METADATA_PATH) {
                xmlObjPaths.ele('objMetadataPath ', {
                    techDescription: path.Description
                }, path.Target);
            }
        });
        return xmlObjPaths;
    }
    Parser.objPaths2xml = objPaths2xml;
    function item2xml(item) {
        let xmlItem = XMLBuilder.create('item');
        xmlItem.ele('itemID', {}, item.ID);
        if (item.Slug)
            xmlItem.ele('itemSlug', {}, item.Slug);
        xmlItem.ele('objID', {}, item.ObjectID);
        xmlItem.ele('mosID', {}, item.MOSID);
        if (item.mosAbstract)
            xmlItem.ele('mosAbstract', {}, item.mosAbstract);
        if (item.Paths) {
            let xmlObjPaths = objPaths2xml(item.Paths);
            xmlItem.importDocument(xmlObjPaths);
        }
        //  objPaths?
        // 	  objPath*
        // 	  objProxyPath*
        // 	  objMetadataPath*
        if (item.Channel)
            xmlItem.ele('itemChannel', {}, item.Channel);
        if (item.EditorialStart)
            xmlItem.ele('itemEdStart', {}, item.EditorialStart);
        if (item.EditorialDuration)
            xmlItem.ele('itemEdDur', {}, item.EditorialDuration);
        if (item.UserTimingDuration)
            xmlItem.ele('itemUserTimingDur', {}, item.UserTimingDuration);
        if (item.Trigger)
            xmlItem.ele('itemTrigger', {}, item.Trigger);
        if (item.MacroIn)
            xmlItem.ele('macroIn', {}, item.MacroIn);
        if (item.MacroOut)
            xmlItem.ele('macroOut', {}, item.MacroOut);
        if (item.MacroOut)
            xmlItem.ele('mosExternalMetadata', {}, item.MacroOut);
        if (item.MosExternalMetaData) {
            item.MosExternalMetaData.forEach((md) => {
                let xmlMetaData = metaData2xml(md);
                xmlItem.importDocument(xmlMetaData);
            });
        }
        return xmlItem;
    }
    Parser.item2xml = item2xml;
    function fixPayload(obj) {
        if (typeof obj === 'object') {
            for (let key in obj) {
                let o = obj[key];
                if (typeof o === 'object') {
                    if (isEmpty(o)) {
                        obj[key] = '';
                    }
                    else {
                        fixPayload(o);
                    }
                }
            }
        }
        return obj;
    }
    function xml2MetaData(xml) {
        if (!xml)
            return [];
        let xmlMetadata = xml;
        if (!Array.isArray(xml))
            xmlMetadata = [xmlMetadata];
        return xmlMetadata.map((xmlmd) => {
            let md = {
                MosScope: (xmlmd.hasOwnProperty('mosScope') ? xmlmd.mosScope : null),
                MosSchema: xmlmd.mosSchema + '',
                MosPayload: fixPayload(xmlmd.mosPayload)
            };
            return md;
        });
    }
    Parser.xml2MetaData = xml2MetaData;
    function metaData2xml(md) {
        // let xmlMD = XMLBuilder.create('mosExternalMetadata')
        // if (md.MosScope) xmlMD.ele('mosScope', {}, md.MosScope)
        // xmlMD.ele('mosSchema', {}, md.MosSchema)
        // let payload = parser.toXml(md.MosPayload)  // TODO: implement this properly, convert to xml
        // let payload = js2xml({ mosExternalMetadata: md }, { compact: true })
        return XMLBuilder.create({ mosExternalMetadata: md });
        // xmlMD.ele('mosPayload', {}, payload)
        // return xmlMD
    }
    Parser.metaData2xml = metaData2xml;
    function xml2IDs(xml) {
        let arr = [];
        let xmlIds = xml;
        if (!Array.isArray(xmlIds))
            xmlIds = [xmlIds];
        xmlIds.forEach((id) => {
            arr.push(new mosString128_1.MosString128(id));
        });
        return arr;
    }
    Parser.xml2IDs = xml2IDs;
    function xml2ROAck(xml) {
        let roAck = new index_1.ROAck();
        roAck.ID = new mosString128_1.MosString128(xml.roID);
        roAck.Status = new mosString128_1.MosString128(xml.roStatus);
        let xmlStoryIDs = xml.storyID;
        let xmlItemIDs = xml.itemID;
        let xmlObjIDs = xml.objID;
        let xmlStatuses = xml.status;
        if (!Array.isArray(xmlStoryIDs))
            xmlStoryIDs = [xmlStoryIDs];
        if (!Array.isArray(xmlItemIDs))
            xmlItemIDs = [xmlItemIDs];
        if (!Array.isArray(xmlObjIDs))
            xmlObjIDs = [xmlObjIDs];
        if (!Array.isArray(xmlStatuses))
            xmlStatuses = [xmlStatuses];
        roAck.Stories = [];
        let iMax = Math.max(xmlStoryIDs.length, xmlItemIDs.length, xmlObjIDs.length, xmlStatuses.length);
        let story = null;
        let item = null;
        let object = null;
        for (let i = 0; i < iMax; i++) {
            if (xmlStoryIDs[i]) {
                story = {
                    ID: new mosString128_1.MosString128(xmlStoryIDs[i]),
                    Items: []
                };
                roAck.Stories.push(story);
            }
            if (xmlItemIDs[i]) {
                item = {
                    ID: new mosString128_1.MosString128(xmlStoryIDs[i]),
                    Channel: new mosString128_1.MosString128(''),
                    Objects: []
                };
                if (story)
                    story.Items.push(item);
            }
            if (xmlObjIDs[i] && xmlStatuses[i]) {
                object = {
                    Status: xmlStatuses[i]
                };
                if (item)
                    item.Objects.push(object);
            }
        }
        return roAck;
    }
    Parser.xml2ROAck = xml2ROAck;
    function xml2MosObjs(xml) {
        if (!xml)
            return [];
        let xmlObjs = [];
        xmlObjs = xml;
        if (!Array.isArray(xmlObjs))
            xmlObjs = [xmlObjs];
        return xmlObjs.map((xmlObj) => {
            return xml2MosObj(xmlObj);
        });
    }
    Parser.xml2MosObjs = xml2MosObjs;
    function xml2MosObj(xml) {
        let mosObj = {
            ID: new mosString128_1.MosString128(xml.objID),
            Slug: new mosString128_1.MosString128(xml.objSlug),
            MosAbstract: xml.mosAbstract,
            Group: xml.objGroup,
            Type: xml.objType,
            TimeBase: xml.objTB,
            Revision: xml.objRev,
            Duration: xml.objDur,
            Status: xml.status,
            AirStatus: xml.objAir,
            Paths: xml2ObjPaths(xml.objPaths),
            CreatedBy: new mosString128_1.MosString128(xml.createdBy),
            Created: new mosTime_1.MosTime(xml.created),
            ChangedBy: new mosString128_1.MosString128(xml.changedBy),
            Changed: new mosTime_1.MosTime(xml.changed),
            Description: xml.description
        };
        if (xml.hasOwnProperty('mosExternalMetadata'))
            mosObj.MosExternalMetaData = xml2MetaData(xml.mosExternalMetadata);
        if (xml.hasOwnProperty('mosItemEditorProgID'))
            mosObj.MosItemEditorProgID = new mosString128_1.MosString128(xml.mosItemEditorProgID);
        return mosObj;
    }
    Parser.xml2MosObj = xml2MosObj;
    function mosObj2xml(obj) {
        let xml = XMLBuilder.create('mosObj');
        attachMosObj2xml(obj, xml);
        // Todo: metadata:
        return xml;
    }
    Parser.mosObj2xml = mosObj2xml;
    function attachMosObj2xml(obj, xml) {
        if (obj.ID)
            xml.ele('objID', {}, obj.ID);
        xml.ele('objSlug', {}, obj.Slug);
        if (obj.MosAbstract)
            xml.ele('mosAbstract', {}, obj.MosAbstract);
        if (obj.Group)
            xml.ele('objGroup', {}, obj.Group);
        xml.ele('objType', {}, obj.Type);
        xml.ele('objTB', {}, obj.TimeBase);
        xml.ele('objRev', {}, obj.Revision);
        xml.ele('objDur', {}, obj.Duration);
        xml.ele('status', {}, obj.Status);
        xml.ele('objAir', {}, obj.AirStatus);
        if (obj.Paths) {
            let xmlObjPaths = objPaths2xml(obj.Paths);
            xml.importDocument(xmlObjPaths);
        }
        xml.ele('createdBy', {}, obj.CreatedBy);
        xml.ele('created', {}, obj.Created);
        if (obj.ChangedBy)
            xml.ele('changedBy', {}, obj.ChangedBy);
        if (obj.Changed)
            xml.ele('changed', {}, obj.Changed);
        if (obj.Description)
            xml.ele('description', {}, obj.Description);
        if (obj.MosExternalMetaData) {
            obj.MosExternalMetaData.forEach((md) => {
                let xmlMetaData = metaData2xml(md);
                xml.importDocument(xmlMetaData);
            });
        }
    }
    Parser.attachMosObj2xml = attachMosObj2xml;
    function xml2Body(xml) {
        let body = [];
        /*
        // Not able to implement this currently, need to change {arrayNotation: true} in xml2json option
        let elementKeys = Object.keys(xml)
        elementKeys.forEach((key: string) => {
            // let elements
            let d = xml[key]

            if (!Array.isArray(d)) d = [d]

            d.forEach((el: any) => {
                let bodyItem: IMOSROFullStoryBodyItem = {
                    Type: key,
                    Content: el
                }
                body.push(bodyItem)
            })
        })
        console.log('xml2Body', body)
        */
        if (xml.elements && Array.isArray(xml.elements)) {
            for (const item of xml.elements) {
                let bodyItem = {
                    Type: item.$name || item.$type,
                    Content: item
                };
                if (item.$name === 'storyItem') {
                    bodyItem.Content = xml2Item(item);
                }
                body.push(bodyItem);
            }
        }
        // Temporary implementation:
        if (xml.storyItem) {
            let items = xml.storyItem;
            if (!Array.isArray(items))
                items = [items];
            items.forEach((item) => {
                let bodyItem = {
                    Type: 'storyItem',
                    Content: item
                };
                body.push(bodyItem);
            });
        }
        return body;
    }
    Parser.xml2Body = xml2Body;
    function xml2ReqObjList(xml) {
        const list = {
            username: xml.username,
            queryID: xml.queryID,
            listReturnStart: xml.listReturnStart,
            listReturnEnd: xml.listReturnEnd,
            generalSearch: xml.generalSearch,
            mosSchema: xml.mosSchema,
            searchGroups: []
        };
        if (typeof list.listReturnStart === 'object')
            list.listReturnStart = null;
        if (typeof list.listReturnEnd === 'object')
            list.listReturnEnd = null;
        for (const searchGroup of xml.searchGroup) {
            const i = list.searchGroups.push({ searchFields: searchGroup.searchField });
            for (const searchField of list.searchGroups[i - 1].searchFields) {
                if (searchField.sortByOrder)
                    searchField.sortByOrder = parseInt(searchField.sortByOrder + '', 10);
            }
        }
        return list;
    }
    Parser.xml2ReqObjList = xml2ReqObjList;
})(Parser = exports.Parser || (exports.Parser = {}));
//# sourceMappingURL=Parser.js.map