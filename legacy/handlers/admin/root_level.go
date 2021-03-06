/*
Wajibu is an online web app that collects,analyses, aggregates and visualizes sentiments
from the public pertaining the government of a nation. This tool allows citizens to contribute
to the governance talk by airing out their honest views about the state of the nation and in
particular the people placed in government or leadership positions.

Copyright (C) 2017
David 'Dexter' Mwangi
dmwangimail@gmail.com
https://github.com/daviddexter
https://github.com/daviddexter/wajibu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
package admin

import (
	"sync"
	tmpl "text/template"

	"github.com/daviddexter/wajibu/handlers/types"
	"github.com/daviddexter/wajibu/server/dbase"
)

func getRootLevelReps(h struct{ GovName string }) *types.GetHouseSlotsData {
	var wg sync.WaitGroup
	var rAll types.GetHouseSlotsData
	wg.Add(2)
	go func(gov string) {
		//get slotnames from db
		defer wg.Done()
		rAll.Slots = *dbase.GetRepSlotsForRoot(gov)
	}(tmpl.JSEscapeString(tmpl.HTMLEscapeString(h.GovName)))
	go func(gov string) {
		//get slot designation from db
		defer wg.Done()
		rAll.Designation = *dbase.GetRepSlotsForRootDesignation(gov)
	}(tmpl.JSEscapeString(tmpl.HTMLEscapeString(h.GovName)))
	wg.Wait()
	return &rAll
}

func rootLevelConfigurer(h struct {
	Designation string
	Type        string
	Data        struct {
		SlotName string
	}
}) *types.ConfigAll {
	var wg sync.WaitGroup
	var pillarsOptions []string
	var repSlots map[string]string
	var api string
	var image string
	wg.Add(3)
	go func() {
		//get pillars
		defer wg.Done()
		p := *dbase.GetPillarsFor(h)
		for i := range p {
			pillarsOptions = append(pillarsOptions, p[i])
		}
	}()
	go func() {
		//get locations => same as represeneted slot
		defer wg.Done()
		//repSlots = *dbase.GetSlotsRepForRoot(h.Data.SlotName)
		s := make(map[string]string)
		s[h.Designation] = tmpl.JSEscapeString(tmpl.HTMLEscapeString(h.Data.SlotName))
		repSlots = s
	}()
	go func() {
		defer wg.Done()
		m := *dbase.GetAPIofForLevelAndImage(h)
		api = m["api"]
		image = m["image"]
	}()
	wg.Wait()

	var Configuration types.ConfigAll //all configurations

	var ForWho types.FormConfig // who does the sentiment belong to
	ForWho.Type = "text"
	ForWho.Name = "api"
	ForWho.Label = api
	Configuration.Config = append(Configuration.Config, ForWho)

	var Image types.FormConfig // who does the sentiment belong to image
	Image.Type = "text"
	Image.Name = "image"
	Image.Label = image
	Configuration.Config = append(Configuration.Config, Image)

	var PillarsConfig types.FormConfig //pillars
	PillarsConfig.Type = "select"
	PillarsConfig.Name = "pillars"
	for i := range pillarsOptions {
		PillarsConfig.Options = append(PillarsConfig.Options, pillarsOptions[i])
	}
	PillarsConfig.Placeholder = "pillars"
	Configuration.Config = append(Configuration.Config, PillarsConfig)

	var SentimentConfig types.FormConfig
	SentimentConfig.Type = "textarea"
	SentimentConfig.Name = "sentiment"
	SentimentConfig.Placeholder = "respondent sentiment"
	Configuration.Config = append(Configuration.Config, SentimentConfig)

	for k, v := range repSlots {
		var Slot types.FormConfig
		Slot.Type = "inputdefault"
		Slot.Name = k
		Slot.Placeholder = "respondent " + " " + k
		Slot.Value = v
		Configuration.Config = append(Configuration.Config, Slot)
	}

	var ButtonConfig types.FormConfig
	ButtonConfig.Type = "button"
	ButtonConfig.Name = "submit"
	ButtonConfig.Label = "SUBMIT"
	Configuration.Config = append(Configuration.Config, ButtonConfig)

	return &Configuration
}
