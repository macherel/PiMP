describe("vlc.wrapper.tests.js", function() {

	describe("creation", function() {
	  it("when creating wrapper with mock", function() {
	  	var callCount = 0;

	  	var mock = new VLCMock();
	  	mock.playlist.clear = function () {
	  		callCount++;
	  	};

	  	expect(callCount).toEqual(0);

	  	new VLCWrapper(mock);

	  	expect(callCount).toEqual(1);
	  });

	  it("when creating wrapper with id", function() {

	  	new VLCWrapper("JASMINE_test_CREATING_wrapper_WITH_id");

	  	var vlc = document.getElementById("JASMINE_test_CREATING_wrapper_WITH_id");
	  	expect(vlc).toBeDefined();
	  	expect(vlc).not.toBeNull();
	  	expect(vlc.nodeName).toBe("EMBED");
	  	expect(vlc.id).toBe("JASMINE_test_CREATING_wrapper_WITH_id");

	  });
	});

	describe("video definitions", function() {

	  it("when adding elements to playlist", function() {
	  	var wrapper = new VLCWrapper(new VLCMock());

	  	var video = {
	  		id: "JASMINE_test_ADDING_element_TO_playlist"
	  	};

	  	expect(wrapper.videos).toBeDefined();
	  	expect(wrapper.videos[video.id]).not.toBeDefined();

		wrapper.putVideoDefinitions([video]);

	  	expect(wrapper.videos[video.id]).toBeDefined();
	  	expect(wrapper.videos[video.id]).not.toBeNull();
	  	expect(wrapper.videos[video.id]).toBe(video);
	  });
	});
});