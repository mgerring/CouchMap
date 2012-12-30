require 'rubygems'
require 'bundler/setup'
require 'nokogiri'
require 'open-uri'
require 'httparty'
require 'geocoder'

class CouchSurfer
	include HTTParty
end

class MapController < ApplicationController
  def scrape
    Geocoder.configure(:lookup => :yandex)
  	@name = params[:name]
  	@url = "https://www.couchsurfing.org/people/#{@name}"
  	profile = CouchSurfer.get("https://www.couchsurfing.org/people/#{@name}?all_references=1")
  	doc = Nokogiri::HTML(profile)
  	reccos = doc.css('.reference_from_to_box>.reference_from')
  	@refs = []
  	reccos.each do |rec|
  		name = rec.css('.profile-image').first.attr('href')
  		name = name.split('/').last
      loc_date = rec.css('small')
      date = loc_date.css('sup').first.content
      loc = loc_date.first.content.sub(date,'')
      loc_name = loc
      loc = Geocoder.search(loc).first
      puts loc
      lat = loc.latitude
      lng = loc.longitude
      ref = rec.css('p').first.content
      img = rec.css('.profile-image img').first
  		single_ref = {
  			'img' => [img['src'],img['width'],img['height']],
        'nicename' => img['alt'],
  			'username' => name,
        'loc_name' => loc_name,
        'date' => date,
        'lat' => lat,
        'lng' => lng,
        'ref' => ref
  		}
  		@refs.push(single_ref)
  	end
    return render :json => @refs 
  end

  def view
    @name = params[:name]
  end
end
