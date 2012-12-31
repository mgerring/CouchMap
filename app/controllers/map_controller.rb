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
      loc_date = rec.css('small')
      date = loc_date.css('sup').first.content
      loc_name = loc_date.first.content.sub(date,'')
      loc = Geocoder.search(loc_name).first
      !loc ? next : #nothing
      lat = loc.latitude
      lng = loc.longitude
      name = rec.css('.profile-image').first.attr('href').split('/').last
      host = rec.css('[src="/images/icon_hosted.gif"]').first
      host = host ? host.attr('title') : nil
      surfer = rec.css('[src="/images/icon_surfed_with.gif"]').first
      surfer = surfer ? surfer.attr('title') : nil
      ref = rec.css('p').first.content
      img = rec.css('.profile-image img').first
  		single_ref = {
  			'img' => [img['src'],img['width'],img['height']],
        'nicename' => img['alt'],
  			'username' => name,
        'loc_name' => loc_name,
        'host' => host,
        'surfer' => surfer,
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
