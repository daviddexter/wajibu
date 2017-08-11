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

	"github.com/daviddexter/wajibu/handlers/types"
	"github.com/daviddexter/wajibu/server/dbase"
)

func presidentLevelConfigurer() *types.ConfigAll {
	var wg sync.WaitGroup
	wg.Add(3)
	var pillarsOptions []string
	var repSlots map[string][]string
	var api string
	go func() {
		//get pillars
		defer wg.Done()
		p := *dbase.GetPillarsFor("president")
		for i := range p {
			pillarsOptions = append(pillarsOptions, p[i])
		}
	}()

	go func() {
		//get locations => same as represeneted slot
		defer wg.Done()
		repSlots = *dbase.GetRepSlots()
	}()

	go func() {
		defer wg.Done()
		api = *dbase.GetAPIofForTopLevel("president")
	}()
	wg.Wait()

	var Configuration types.ConfigAll //all configurations

	var ForWho types.FormConfig // who does the sentiment belong to
	ForWho.Type = "text"
	ForWho.Label = api
	Configuration.Config = append(Configuration.Config, ForWho)

	var PillarsConfig types.FormConfig //pillars
	PillarsConfig.Type = "select"
	PillarsConfig.Name = "pillars"
	for i := range pillarsOptions {
		PillarsConfig.Options = append(PillarsConfig.Options, pillarsOptions[i])
	}
	PillarsConfig.Placeholder = "pillars"
	Configuration.Config = append(Configuration.Config, PillarsConfig)

	var SentimentConfig types.FormConfig
	SentimentConfig.Type = "input"
	SentimentConfig.Name = "sentiment"
	SentimentConfig.Placeholder = "respondent sentiment"
	Configuration.Config = append(Configuration.Config, SentimentConfig)

	for k, v := range repSlots {
		var Slot types.FormConfig
		Slot.Type = "select"
		Slot.Name = k
		for i := range v {
			Slot.Options = append(Slot.Options, v[i])
		}
		Slot.Placeholder = "respondent " + " " + k
		Configuration.Config = append(Configuration.Config, Slot)
	}

	var ButtonConfig types.FormConfig
	ButtonConfig.Type = "button"
	ButtonConfig.Name = "submit"
	ButtonConfig.Label = "SUBMIT"
	Configuration.Config = append(Configuration.Config, ButtonConfig)

	return &Configuration

}

func dpresidentLevelConfigurer() *types.ConfigAll {
	var wg sync.WaitGroup
	wg.Add(3)
	var pillarsOptions []string
	var repSlots map[string][]string
	var api string
	go func() {
		//get pillars
		defer wg.Done()
		p := *dbase.GetPillarsFor("deputy president")
		for i := range p {
			pillarsOptions = append(pillarsOptions, p[i])
		}
	}()

	go func() {
		//get locations => same as represeneted slot
		defer wg.Done()
		repSlots = *dbase.GetRepSlots()
	}()

	go func() {
		defer wg.Done()
		api = *dbase.GetAPIofForTopLevel("deputy president")
	}()
	wg.Wait()

	var Configuration types.ConfigAll //all configurations

	var ForWho types.FormConfig // who does the sentiment belong to
	ForWho.Type = "text"
	ForWho.Label = api
	Configuration.Config = append(Configuration.Config, ForWho)

	var PillarsConfig types.FormConfig //pillars
	PillarsConfig.Type = "select"
	PillarsConfig.Name = "pillars"
	for i := range pillarsOptions {
		PillarsConfig.Options = append(PillarsConfig.Options, pillarsOptions[i])
	}
	PillarsConfig.Placeholder = "pillars"
	Configuration.Config = append(Configuration.Config, PillarsConfig)

	var SentimentConfig types.FormConfig
	SentimentConfig.Type = "input"
	SentimentConfig.Name = "sentiment"
	SentimentConfig.Placeholder = "respondent sentiment"
	Configuration.Config = append(Configuration.Config, SentimentConfig)

	for k, v := range repSlots {
		var Slot types.FormConfig
		Slot.Type = "select"
		Slot.Name = k
		for i := range v {
			Slot.Options = append(Slot.Options, v[i])
		}
		Slot.Placeholder = "respondent " + " " + k
		Configuration.Config = append(Configuration.Config, Slot)
	}

	var ButtonConfig types.FormConfig
	ButtonConfig.Type = "button"
	ButtonConfig.Name = "submit"
	ButtonConfig.Label = "SUBMIT"
	Configuration.Config = append(Configuration.Config, ButtonConfig)

	return &Configuration

}

func houseLevelCongfigure() {

}
