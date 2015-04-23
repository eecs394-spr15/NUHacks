# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Home"
      id: "index"
      location: "hacks#feed" # Supersonic module#view type navigation
    }
    {
      title: "Tags"
      id: "tags"
      location: "tags#index"
    }

    {
      title: "Search"
      id: "widesearch"
      location: "widesearch#index"

    }


    {
      title: "Search"
      id: "widesearch"
      location: "widesearch#index" # URLs are supported!
    }
    {
      title: "Profile"
      id: "profile"
      location: "profile#profile" # URLs are supported!
    }
   
  ]

  # rootView:
  #   location: "example#getting-started"

  preloads: [
    {
      id: "learn-more"
      location: "example#learn-more"
    }
    {
      id: "using-the-scanner"
      location: "example#using-the-scanner"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
