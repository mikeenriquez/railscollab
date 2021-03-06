=begin
RailsCollab
-----------

Copyright (C) 2008 James S Urquhart (jamesu at gmail.com)

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
=end

class ConfigHandler
	include ActionView::Helpers
	include ActionView::Helpers::FormTagHelper
	include ActionView::Helpers::FormOptionsHelper
	include ActionView::Helpers::TagHelper
	
	include ApplicationHelper
	
	attr_accessor :configOption, :rawValue
	
	def initialize
		@configOption = nil
		@rawValue = ""
		@value = ""
	end
	
	def value
		return @rawValue
	end
	
	def value=(val)
		@rawValue = val
	end
	
	def render(name, options)
		""
	end
end
