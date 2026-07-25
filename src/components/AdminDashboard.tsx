import React from 'react';
import { motion } from 'motion/react';
import { useAdminData } from './admin/hooks/useAdminData';
import AdminHeader from './admin/components/AdminHeader';
import AdminSidebar from './admin/components/AdminSidebar';
import StatsBar from './admin/components/StatsBar';
import SchoolProfileView from './admin/components/SchoolProfileView';
import EditScheduleModal from './admin/components/EditScheduleModal';
import ApprovalsTab from './admin/tabs/ApprovalsTab';
import StudentsTab from './admin/tabs/StudentsTab';
import ExamsTab from './admin/tabs/ExamsTab';
import BroadcastingTab from './admin/tabs/BroadcastingTab';
import CentersTab from './admin/tabs/CentersTab';
import DatabaseTab from './admin/tabs/DatabaseTab';
import ScheduleTab from './admin/tabs/ScheduleTab';
import ChangePasswordCard from './ui/ChangePasswordCard';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const admin = useAdminData();



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="eno-admin-panel">
      
      {/* Top dashboard control header */}
      <AdminHeader onLogout={onLogout} />

      {/* Main split viewport */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Mobile Navigation Horizontal Bar */}
        <div className="md:hidden flex items-center gap-2 p-2.5 bg-white border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => admin.setActiveTab('approvals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'approvals' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            School Requests
          </button>
          <button
            onClick={() => admin.setActiveTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'students' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Manage Students
          </button>
          <button
            onClick={() => admin.setActiveTab('exams')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'exams' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Mock Composer
          </button>
          <button
            onClick={() => admin.setActiveTab('broadcasting')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'broadcasting' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Broadcaster
          </button>
          <button
            onClick={() => admin.setActiveTab('centers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'centers' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Centers Desk
          </button>
          <button
            onClick={() => admin.setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Schedule Desk
          </button>
          <button
            onClick={() => admin.setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'database' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Database Desk
          </button>
          <button
            onClick={() => admin.setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${admin.activeTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
          >
            Security & Pass
          </button>
        </div>

        {/* Left Side Navigation Panel */}
        <AdminSidebar
          activeTab={admin.activeTab}
          setActiveTab={admin.setActiveTab}
          setSelectedSchoolProfile={admin.setSelectedSchoolProfile}
          pendingRequestsCount={admin.schools.filter(s => s.status === 'PENDING').length}
          earnings={admin.stats?.totalEarnings ?? 0}
        />

        {/* Dynamic primary tab canvas */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {admin.selectedSchoolProfile ? (
            <SchoolProfileView
              selectedSchoolProfile={admin.selectedSchoolProfile}
              setSelectedSchoolProfile={admin.setSelectedSchoolProfile}
              handleRejectSchool={admin.handleRejectSchool}
              handleApproveSchool={admin.handleApproveSchool}
              handleDeleteSchool={admin.handleDeleteSchool}
              fetchAdminData={admin.fetchAdminData}
              passingMarksEdit={admin.passingMarksEdit}
              setPassingMarksEdit={admin.setPassingMarksEdit}
              savingPassingMarks={admin.savingPassingMarks}
              passingMarksSuccess={admin.passingMarksSuccess}
              passingMarksError={admin.passingMarksError}
              handleSavePassingMarks={admin.handleSavePassingMarks}
              schoolRosterSearch={admin.schoolRosterSearch}
              setSchoolRosterSearch={admin.setSchoolRosterSearch}
              schoolRosterClassFilter={admin.schoolRosterClassFilter}
              setSchoolRosterClassFilter={admin.setSchoolRosterClassFilter}
              students={admin.students}
              handleApproveCandidatePayment={admin.handleApproveCandidatePayment}
              handleUpdateScore={admin.handleUpdateScore}
            />
          ) : (
            <>
              {/* Stats Bar (visible when no specific profile is loaded) */}
              <StatsBar stats={admin.stats} />

              {/* Tab views */}
              {admin.activeTab === 'approvals' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <ApprovalsTab
                    schools={admin.schools}
                    schoolSearch={admin.schoolSearch}
                    setSchoolSearch={admin.setSchoolSearch}
                    handleApproveSchool={admin.handleApproveSchool}
                    handleRejectSchool={admin.handleRejectSchool}
                    handleDeleteSchool={admin.handleDeleteSchool}
                    setSelectedSchoolProfile={admin.setSelectedSchoolProfile}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'students' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <StudentsTab
                    students={admin.students}
                    studentSearch={admin.studentSearch}
                    setStudentSearch={admin.setStudentSearch}
                    isBulkUploadOpen={admin.isBulkUploadOpen}
                    setIsBulkUploadOpen={admin.setIsBulkUploadOpen}
                    bulkStatusMessage={admin.bulkStatusMessage}
                    setBulkStatusMessage={admin.setBulkStatusMessage}
                    bulkInputText={admin.bulkInputText}
                    setBulkInputText={admin.setBulkInputText}
                    handleBulkUploadResultsSubmit={admin.handleBulkUploadResultsSubmit}
                    handleApproveCandidatePayment={admin.handleApproveCandidatePayment}
                    handleUpdateScore={admin.handleUpdateScore}
                    handleStage1Release={admin.handleStage1Release}
                    handleStage2Release={admin.handleStage2Release}
                    handleManualQualify={admin.handleManualQualify}
                    handleAllocateCenter={admin.handleAllocateCenter}
                    centers={admin.centers}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'exams' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <ExamsTab
                    exams={admin.exams}
                    aiGroup={admin.aiGroup}
                    setAiGroup={admin.setAiGroup}
                    aiDifficulty={admin.aiDifficulty}
                    setAiDifficulty={admin.setAiDifficulty}
                    aiCount={admin.aiCount}
                    setAiCount={admin.setAiCount}
                    aiDuration={admin.aiDuration}
                    setAiDuration={admin.setAiDuration}
                    aiTopic={admin.aiTopic}
                    setAiTopic={admin.setAiTopic}
                    aiGenerating={admin.aiGenerating}
                    aiStatusMessage={admin.aiStatusMessage}
                    aiError={admin.aiError}
                    aiPreviewExam={admin.aiPreviewExam}
                    handleAIGenerateExam={admin.handleAIGenerateExam}
                    handleEditPreviewTitle={admin.handleEditPreviewTitle}
                    handleEditPreviewClassGroup={admin.handleEditPreviewClassGroup}
                    handleEditPreviewDuration={admin.handleEditPreviewDuration}
                    handleAddPreviewQuestionSlot={admin.handleAddPreviewQuestionSlot}
                    handleDeletePreviewQuestion={admin.handleDeletePreviewQuestion}
                    handleEditPreviewQuestionText={admin.handleEditPreviewQuestionText}
                    handleEditPreviewQuestionOption={admin.handleEditPreviewQuestionOption}
                    handleEditPreviewQuestionCorrectOption={admin.handleEditPreviewQuestionCorrectOption}
                    handlePublishAIExam={admin.handlePublishAIExam}
                    selectedAdminSyllabusId={admin.selectedAdminSyllabusId}
                    setSelectedAdminSyllabusId={admin.setSelectedAdminSyllabusId}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'broadcasting' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <BroadcastingTab
                    announcements={admin.announcements}
                    noticeTitle={admin.noticeTitle}
                    setNoticeTitle={admin.setNoticeTitle}
                    noticeContent={admin.noticeContent}
                    setNoticeContent={admin.setNoticeContent}
                    noticeAudience={admin.noticeAudience}
                    setNoticeAudience={admin.setNoticeAudience}
                    handleCreateAnnouncement={admin.handleCreateAnnouncement}
                    headerAnnouncementText={admin.headerAnnouncementText}
                    setHeaderAnnouncementText={admin.setHeaderAnnouncementText}
                    savingHeaderAnnouncement={admin.savingHeaderAnnouncement}
                    headerAnnouncementSuccess={admin.headerAnnouncementSuccess}
                    handleSaveHeaderAnnouncement={admin.handleSaveHeaderAnnouncement}
                    handleDeleteHeaderAnnouncement={admin.handleDeleteHeaderAnnouncement}
                    sliderImages={admin.sliderImages}
                    newSliderImageUrl={admin.newSliderImageUrl}
                    setNewSliderImageUrl={admin.setNewSliderImageUrl}
                    savingSliderImage={admin.savingSliderImage}
                    sliderSuccess={admin.sliderSuccess}
                    handleSaveSliderImage={admin.handleSaveSliderImage}
                    handleDeleteSliderImage={admin.handleDeleteSliderImage}
                    handleUploadSliderImage={admin.handleUploadSliderImage}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'centers' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <CentersTab
                    centers={admin.centers}
                    cenName={admin.cenName}
                    setCenName={admin.setCenName}
                    cenCity={admin.cenCity}
                    setCenCity={admin.setCenCity}
                    cenCap={admin.cenCap}
                    setCenCap={admin.setCenCap}
                    handleCreateCenter={admin.handleCreateCenter}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'database' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <DatabaseTab
                    dbItems={admin.dbItems}
                    dbUsers={admin.dbUsers}
                    newItemName={admin.newItemName}
                    setNewItemName={admin.setNewItemName}
                    newItemCategory={admin.newItemCategory}
                    setNewItemCategory={admin.setNewItemCategory}
                    newItemDesc={admin.newItemDesc}
                    setNewItemDesc={admin.setNewItemDesc}
                    newItemPrice={admin.newItemPrice}
                    setNewItemPrice={admin.setNewItemPrice}
                    handleCreateDBItem={admin.handleCreateDBItem}
                    handleDeleteDBItem={admin.handleDeleteDBItem}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'schedule' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <ScheduleTab
                    schedule={admin.schedule}
                    setSchedule={admin.setSchedule}
                    scheduleSuccess={admin.scheduleSuccess}
                    setScheduleSuccess={admin.setScheduleSuccess}
                    scheduleError={admin.scheduleError}
                    setScheduleError={admin.setScheduleError}
                    scheduleSaving={admin.scheduleSaving}
                    setScheduleSaving={admin.setScheduleSaving}
                    handleSaveSchedule={admin.handleSaveSchedule}
                    schools={admin.schools}
                    getSchoolExamStatus={admin.getSchoolExamStatus}
                    scheduleSearchFilter={admin.scheduleSearchFilter}
                    setScheduleSearchFilter={admin.setScheduleSearchFilter}
                    scheduleStatusFilter={admin.scheduleStatusFilter}
                    setScheduleStatusFilter={admin.setScheduleStatusFilter}
                    scheduleStartDateFilter={admin.scheduleStartDateFilter}
                    setScheduleStartDateFilter={admin.setScheduleStartDateFilter}
                    scheduleEndDateFilter={admin.scheduleEndDateFilter}
                    setScheduleEndDateFilter={admin.setScheduleEndDateFilter}
                    handleEditScheduleClick={admin.handleEditScheduleClick}
                  />
                </motion.div>
              )}

              {admin.activeTab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <div className="max-w-4xl mx-auto">
                    <ChangePasswordCard role="admin" email={user?.email || "admin@eno.org"} />
                  </div>
                </motion.div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Edit schedule modal */}
      <EditScheduleModal
        editingSchoolId={admin.editingSchoolId}
        setEditingSchoolId={admin.setEditingSchoolId}
        schools={admin.schools}
        editPreExamDate={admin.editPreExamDate}
        setEditPreExamDate={admin.setEditPreExamDate}
        editPreExamTime={admin.editPreExamTime}
        setEditPreExamTime={admin.setEditPreExamTime}
        editPreExamDuration={admin.editPreExamDuration}
        setEditPreExamDuration={admin.setEditPreExamDuration}
        editSaveSuccess={admin.editSaveSuccess}
        editSaveError={admin.editSaveError}
        editSaving={admin.editSaving}
        handleSaveSchoolSchedule={admin.handleSaveSchoolSchedule}
      />
    </div>
  );
}
