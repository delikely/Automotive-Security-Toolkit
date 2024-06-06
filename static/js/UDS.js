$('#service_define-data-table').bootstrapTable({
    columns: [
        {
            field: 'SID',
            title: 'Service identifier (SI)',
            class:'SID-class',
            sortable: true,
        },{
            field: 'service_type',
            title: 'Service type',
            class:'service_type-class',
            sortable: true,
        },{
            field: 'defined_in',
            title: 'Defined in',
            class:'defined_in-class',
            sortable: true,
        }
    ],
    sortName: 'SID',
    search: true,
    // showColumns:true,

});


$('#service-data-table').bootstrapTable({
    columns: [
        {
            field: 'SID',
            title: 'Service identifier (SI)',
            class:'SID-class',
            sortable: true,
        },{
            field: 'abbreviation',
            title: 'Abbreviation',
            class:'abbreviation-class',
            sortable: true,
        },{
            field: 'defaultSession',
            title: 'defaultSession',
            class:'defaultSession-class',
            sortable: true,
        },{
            field: 'non_defaultSession',
            title: 'non_defaultSession',
            class:'non_defaultSession-class',
            sortable: true,
        }
    ],
    sortName: 'SID',
    search: true,
    // showColumns:true,

});

$('#DID-data-table').bootstrapTable({
    columns: [
        {
            field: 'DID',
            title: 'DID',
            class:'DID-class',
            sortable: true,
            visible: true,
        },{
            field: 'description',
            title: 'Description',
            class:'description-class',
            sortable: true,
            visible: false
        },{
            field: 'abbreviation',
            title: 'Abbreviation',
            class:'abbreviation-class',
            sortable: true,
            visible: true,
        },{
            
            field: 'mnemonic',
            title: 'Mnemonic',
            class:'mnemonic-class',
            sortable: true,
            visible: true,
        }
    ],
    // sortName: 'DID',
    pagination: false,
    showColumns:true,
    // showColumnsSearch:true,
    search: true,
});

$('#NRC-data-table').bootstrapTable({
    columns: [
        {
            field: 'NRC',
            title: 'NRC',
            class:'NRC-class',
            sortable: true,
        },{
            field: 'description',
            title: 'Description',
            class:'description-class',
            sortable: true,
        },{
            field: 'abbreviation',
            title: 'Abbreviation',
            class:'abbreviation-class',
            sortable: true,
        }
    ],
    sortName: 'NRC',
    search: true,
    // showColumns:true,

});

function loadData(){

    $.ajax({
        url: "static/data/UDS.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result["service_define"],function(index,value){
                data.push({"SID":value["SID"],"service_type": value["Service type"],"defined_in":value["Defined in"]});
            });
            $('#service_define-data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });

    $.ajax({
        url: "static/data/UDS.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result["uds_service"],function(index,value){
                data.push({"SID":value["SID"],"abbreviation": value["abbreviation"],"defaultSession":value["defaultSession"],"non_defaultSession":value["non-defaultSession"]});

            });
            $('#service-data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });
    $.ajax({
        url: "static/data/UDS_DID.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                data.push({"DID":value["DID"],"description": value["description"],"abbreviation":value["abbreviation"],"mnemonic":value["mnemonic"]});
            });
            $('#DID-data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });

    $.ajax({
        url: "static/data/UDS_NRC.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                data.push({"NRC":value["NRC"],"description": value["description"],"abbreviation":value["abbreviation"]});
            });
            $('#NRC-data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });
}

$("#btn-search").click(function () {
    loadData();
})

loadData();


