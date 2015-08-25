{
  "targets": [{
    "target_name": "addon",
    "sources": [
      "src/addon.cc",
      "src/init.cc",
      "src/write.cc",
      "src/read.cc"
    ],
    "include_dirs": [
      "<!(node -e \"require('nan')\")"
    ],
    "link_settings": {
      "libraries": [
        "-lwiringPi"
      ]
    }
  }]
}
