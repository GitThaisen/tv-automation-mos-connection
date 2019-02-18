import {
	xml2js
} from '../Utils'
/*
test('xml2js', () => {
	let o: any = xml2js(`
<roStorySend>
	<storyBody>
		<p>Hello and welcome</p>
		<mosObject>[name sign]</mosObject>
		<p>This is a extra broadcast bla bla</p>
		<mosObject>
		</mosObject>
		<p>Let's look at this video:</p>
		<mosObject>[video]</mosObject>
	</storyBody>
</roStorySend>
	`)
	// console.log('o.roStorySend', o.roStorySend)
	expect(o).toBeTruthy()
	expect(o.roStorySend.storyBody).toMatchObject({
		elements: [
			{ $type: 'text', $name: 'p', text: 'Hello and welcome' },
			{ $type: 'text', $name: 'mosObject', text: '[name sign]' },
			{ $type: 'text', $name: 'p', text: 'This is a extra broadcast bla bla' },
			{ $type: 'element', $name: 'mosObject' },
			{ $type: 'text', $name: 'p', text: 'Let\'s look at this video:' },
			{ $type: 'text', $name: 'mosObject', text: '[video]' }
		]
	})
		// expect(o.mos).toBeTruthy()
})

test('xml2js with "name" element', () => {
	let o: any = xml2js(`
<template>
	<name>52_headline</name>
	<channel>gfx1</channel>
	<layer>super</layer>
	<system>html</system>
</template>
	`)
	// console.log('o', o)
	// expect(o).toBeTruthy()
	expect(o.template).toMatchObject({
		name: '52_headline',
		channel: 'gfx1',
		layer: 'super',
		system: 'html'
	})
		// expect(o.mos).toBeTruthy()
})
*/

test('xml2js with junk', () => {
	let o: any = xml2js(`
<content>
	<navn>Jon Gelius</navn>
	<tittel/>
	<funksjoner>
		<funksjon>Redaktør:</funksjon>
		<navn/>
	</funksjoner>
	<funksjoner>
		<funksjon>Regi:</funksjon>
		<navn/>
	</funksjoner>
	<sami>false</sami>
	<_valid>true</_valid>
</content>
	`)

	expect(o.content).toEqual({
		navn: 'Jon Gelius',
		tittel: {},
		funksjoner: [{
			funksjon: 'Redaktør:',
			navn: {}
		},{
			funksjon: 'Regi:',
			navn: {}
		}],
		sami: false,
		_valid: true
	})
})
test('xml2js with simple array', () => {
	let o: any = xml2js(`
<content>
	<navn>Jon Gelius</navn>
	<tittel/>
	<tematekst/>
	<tematekst/>
</content>
	`)

	expect(o.content).toEqual({
		navn: 'Jon Gelius',
		tittel: {},
		tematekst: [{},{}]
	})
})
test('xml2js with array', () => {
	let o: any = xml2js(`
<content>
	<navn>Jon Gelius</navn>
	<tittel/>
	<tematekst/>
	<infotekst/>
	<funksjoner>
		<funksjon>Redaktør:</funksjon>
		<navn/>
	</funksjoner>
	<funksjoner>
		<funksjon>Regi:</funksjon>
		<navn>Johan</navn>
	</funksjoner>
	<_valid>true</_valid>
</content>
	`)

	expect(o.content).toEqual({
		navn: 'Jon Gelius',
		tittel: {},
		tematekst: {},
		infotekst: {},
		funksjoner: [
			{
				funksjon: 'Redaktør:',
				navn: {}
			},
			{
				funksjon: 'Regi:',
				navn: 'Johan'
			}
		],
		_valid: true
	})
})

test('xml2js with clean', () => {
	let o: any = xml2js(`
<content>
	<navn>Jon Gelius</navn>
	<tittel/>
	<tematekst/>
	<infotekst/>
	<_valid>true</_valid>
</content>
	`)

	expect(o.content).toEqual({
		navn: 'Jon Gelius',
		tittel: {},
		tematekst: {},
		infotekst: {},
		_valid: true
	})
})
